const express = require('express');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const {
  getSingleBrand,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brand.controller');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBrand);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/:id', getSingleBrand);
router.get('/', getAllBrands);

module.exports = router;
