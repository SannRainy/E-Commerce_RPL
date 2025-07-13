const mongoose = require('mongoose');

const customerDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama pelanggan harus diisi'],
  },
  address: {
    type: String,
    required: [true, 'Alamat pelanggan harus diisi'],
  },
  phone: {
    type: String,
    required: [true, 'Nomor telepon pelanggan harus diisi'],
  },
}, { _id: false }); // _id: false agar tidak membuat ID baru untuk sub-dokumen ini

const orderSchema = new mongoose.Schema({
  // Kita bisa merujuk ke ID produk asli jika ada model Product
  // productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  customerDetails: {
    type: customerDetailsSchema,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'],
    default: 'Diproses', // Status default saat pesanan dibuat
  },
}, {
  timestamps: true, // Otomatis menambahkan field createdAt dan updatedAt
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;