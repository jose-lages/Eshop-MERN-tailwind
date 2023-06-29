const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoosedbId = require('../utils/validateMongodbId');

// create blog

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// update blog

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ updateBlog, message: 'blog post updated' });
  } catch (error) {
    throw new Error(error);
  }
});

// get a single blog

const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const getBlog = await Blog.findById(id).populate('likes').populate('dislikes');
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    res.status(200).json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// get all the blogs

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.status(200).json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

// delete a single blog

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.status(200).json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// liked blogs

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoosedbId(blogId);

  const blog = await Blog.findById(blogId); // find blog that you want to like
  const loginUserId = req?.user?._id; // find the login user
  const isLiked = blog?.isLiked; // find if the user has liked the blog previously
  const isDisliked = blog?.dislikes.find(
    (userId) => userId?.toString() === loginUserId?.toString() // find if the blogis already disliked
  );
  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.status(200).json(blog);
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.status(200).json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.status(200).json(blog);
  }
});

// disliked blogs

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoosedbId(blogId);
  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // find the login user
  const loginUserId = req?.user?._id;
  // find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  // find if the user has disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.status(200).json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.status(200).json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.status(200).json(blog);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
