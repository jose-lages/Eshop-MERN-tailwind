const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/userModel');
const validateMongoosedbId = require('../utils/validateMongodbId');

const generateToken = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const sendEmail = require('./email.controller');

// create User

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } else {
    throw new Error('User already exists!');
  }
});

// log in user

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken },
      { new: true }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(200).json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser._id),
    });
  } else {
    throw new Error('Invalid Credentials', 401);
  }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new Error('No refresh token in the cookies');
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error('No token associated with this account in the DB');
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.id) {
      throw new Error('There is something wrong with the refresh token');
    }

    const accessToken = generateToken(user._id);
    res.status(200).json({ accessToken });
  });
});

// logout functions

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new Error('No refresh token in cookies to logout');
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', { httpOnly: true, secure: true }); // delete the cookie from localstorage
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  res.sendStatus(204);
});

// get all users

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.status(200).json({ getUsers });
  } catch (error) {
    throw new Error(error);
  }
});

// get single user

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const getUser = await User.findById(id); // no need to pass as object
    res.status(200).json({ getUser });
  } catch (error) {
    throw new Error(error);
  }
});

// delete a single user

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.status(200).json({ deleteUser });
  } catch (error) {
    throw new Error(error);
  }
});

// update User

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoosedbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

// block user by admin

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const block = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
  } catch (error) {
    throw new Error(error);
  }
  res.status(200).json({
    message: 'User blocked!',
  });
});

// unblock user by admin
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const block = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
  } catch (error) {
    throw new Error(error);
  }
  res.status(200).json({
    message: 'User unblocked!',
  });
});

// update user password

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoosedbId(_id);

  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.status(200).json(updatedPassword);
  } else {
    // res.json(user);
    console.log('not updated');
  }
});

// nodemailer reset token

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hello ${user.firstName}!! Please follow this link to reset your password: <a href="http://localhost:5000/api/user/reset-password/${token}">Click here!!</a>`;

    // email body

    const data = {
      to: email,
      text: `Hello ${user.firstName}!!!`,
      subject: 'Reset Password Link',
      html: resetURL,
    };

    sendEmail(data);

    res.status(200).json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// reset password

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!user) throw new Error('Token Expired, please try again later!');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json(user);
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
};
