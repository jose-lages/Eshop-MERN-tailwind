const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// user authentication middleware
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('Not Authorized! Token expired, please log in again');
    }
  } else {
    throw new Error('there is no token attached to the header');
  }
});

// check if user is admin

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;

  // if user not admin throw error else continue
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== 'admin') {
    throw new Error('Only an admin can perform this action');
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
