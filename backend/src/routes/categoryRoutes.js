const express = require('express');
const {
  getAllCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createCategory);
router.delete('/:categoryId', deleteCategory);

module.exports = router;
