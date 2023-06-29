const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const validateMongoosedbId = require('../utils/validateMongodbId');

//  create a new brand

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.status(201).json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// update existing brand

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// delete existing brand

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    res.status(200).json(deletedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single brand

const getSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const getaBrand = await Brand.findById(id);
    res.status(200).json(getaBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// get all brands

const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.find();
    res.status(200).json(getallBrand);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrands,
};
