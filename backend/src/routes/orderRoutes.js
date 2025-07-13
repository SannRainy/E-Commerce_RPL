const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Amankan rute dengan middleware
router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);
module.exports = router;