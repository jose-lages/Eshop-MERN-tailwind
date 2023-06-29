const express = require('express');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require('../controllers/blog.controller');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.get('/', getAllBlogs);
router.put('/:likes', authMiddleware, isAdmin, likeBlog);
router.put('/:dislikes', authMiddleware, isAdmin, dislikeBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.get('/:id', getSingleBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);

module.exports = router;
