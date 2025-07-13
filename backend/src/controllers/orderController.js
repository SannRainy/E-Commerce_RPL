const Order = require('../models/Order');
const Product = require('../models/Product'); // Diperlukan untuk validasi

// Middleware untuk validasi
const { body, validationResult } = require('express-validator');


exports.createOrder = [
    // Tambahkan Auth Middleware di rute
    // Validasi input
    body('items').isArray({ min: 1 }).withMessage('Keranjang tidak boleh kosong'),
    body('items.*.productId').isMongoId().withMessage('ID Produk tidak valid'),
    body('items.*.quantity').isInt({ gt: 0 }).withMessage('Kuantitas harus lebih dari 0'),
    body('customerDetails.name').notEmpty().withMessage('Nama tidak boleh kosong'),
    body('customerDetails.address').notEmpty().withMessage('Alamat tidak boleh kosong'),
    body('customerDetails.phone').notEmpty().withMessage('Telepon tidak boleh kosong'),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { items, customerDetails } = req.body;
            const buyerId = req.user.id; // Didapat dari authMiddleware

            let totalAmount = 0;
            const productsForOrder = [];

            for (const item of items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return res.status(404).json({ message: `Produk dengan ID ${item.productId} tidak ditemukan` });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Stok untuk ${product.name} tidak mencukupi` });
                }

                totalAmount += product.price * item.quantity;
                productsForOrder.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price // Simpan harga saat itu
                });

                // Kurangi stok
                product.stock -= item.quantity;
                await product.save();
            }

            const newOrder = new Order({
                buyer: buyerId,
                products: productsForOrder,
                totalAmount,
                customerDetails
            });

            const createdOrder = await newOrder.save();
            res.status(201).json(createdOrder);

        } catch (error) {
            next(error);
        }
    }
];


exports.getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({})
      .populate('buyer', 'name email')
      .populate('products.product', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments();
      
    res.status(200).json({
      data: orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalItems: totalOrders,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Status tidak valid' });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
        
        // Logika untuk mengembalikan stok jika pesanan dibatalkan
        if (status === 'Dibatalkan' && order.status !== 'Dibatalkan') {
            for (const item of order.products) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
            }
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);

    } catch (error) {
        next(error);
    }
};