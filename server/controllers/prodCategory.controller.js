const Category = require('../models/prodCategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoosedbId = require('../utils/validateMongodbId');

// create new category

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// update category

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// delete category

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.status(200).json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// get single category

const getSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoosedbId(id);
  try {
    const getaCategory = await Category.findById(id);
    res.status(200).json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// get all the categories

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const getAllCategories = await Category.find();
    res.status(200).json(getAllCategories);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategories,
};
