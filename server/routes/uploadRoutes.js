const express = require('express');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { uploadImages, deleteImages } = require('../controllers/upload.controller');
const { uploadPhoto, productImgResize } = require('../middleware/uploadImage');

const router = express.Router();

router.post(
  '/:id',
  authMiddleware,
  isAdmin,
  uploadPhoto.array('images', 10),
  productImgResize,
  uploadImages
);

router.delete('/delete-img/:id', authMiddleware, isAdmin, deleteImages);

module.exports = router;
