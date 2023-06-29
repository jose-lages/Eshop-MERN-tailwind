const asyncHandler = require('express-async-handler');
const validateMongoosedbId = require('../utils/validateMongodbId');
const Coupon = require('../models/couponModel');

// create coupon

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).status(200).json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// get all coupons

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

// update single coupon

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// delete a single coupon

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.status(200).json(deleteCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single coupon

const getSingleCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const getCoupon = await Coupon.findById(id);
    res.status(200).json(getCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getSingleCoupon,
};
