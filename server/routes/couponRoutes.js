const express = require('express');

const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getSingleCoupon,
} = require('../controllers/coupon.controller');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupons);
router.get('/:id', authMiddleware, isAdmin, getSingleCoupon);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
