const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

// Rute untuk endpoint /api/orders

router.post('/', createOrder);
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;