const Order = require('../models/order');

/**
 * @desc    Membuat pesanan baru
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res) => {
  try {
    // Data yang dikirim dari frontend akan ada di req.body
    const { productName, price, customerDetails } = req.body;

    if (!productName || !price || !customerDetails) {
      return res.status(400).json({ message: 'Harap kirim semua data yang diperlukan' });
    }

    const newOrder = new Order({
      productName,
      price,
      customerDetails,
      // Status akan otomatis diisi 'Diproses' sesuai default di model
    });

    const createdOrder = await newOrder.save();

    // 201 artinya 'Created'
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error(`Error saat membuat pesanan: ${error.message}`);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

/**
 * @desc    Mengambil semua data pesanan
 * @route   GET /api/orders
 * @access  Public (atau Private/Admin di aplikasi nyata)
 */
const getAllOrders = async (req, res) => {
  try {
    // Mengambil semua pesanan dan mengurutkannya berdasarkan yang terbaru
    const orders = await Order.find({}).sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    console.error(`Error saat mengambil pesanan: ${error.message}`);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

/**
 * @desc    Memperbarui status pesanan
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validasi status yang masuk
    const allowedStatuses = ['Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }
  } catch (error) {
    console.error(`Error saat memperbarui status: ${error.message}`);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
};