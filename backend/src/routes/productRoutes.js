const express = require('express');
const upload = require('../middlewares/upload');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:productId', getProductById);

// Tambahkan middleware upload.single
router.post('/', upload.single('image'), createProduct);
router.put('/:productId', upload.single('image'), updateProduct);
router.delete('/:productId', deleteProduct);

module.exports = router;
