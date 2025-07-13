const Product = require('../models/Product');

// GET all products dengan paginasi
exports.getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // Tampilkan 12 produk per halaman
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalProducts = await Product.countDocuments();
    
    res.status(200).json({
      data: products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

// GET single product
exports.getProductById = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate('category');
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// POST create product
exports.createProduct = async (req, res, next) => {
  const { name, description, price, stock, category } = req.body;

  try {
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;
    if (!imageUrl) {
        return res.status(400).json({ message: 'Gambar produk wajib diunggah.' });
    }

    const newProduct = new Product({ name, description, price, stock, category, imageUrl });

    await newProduct.save();
    // Populate kategori setelah disimpan
    const populatedProduct = await Product.findById(newProduct._id).populate('category');
    res.status(201).json(populatedProduct);
  } catch (error) {
    next(error);
  }
};

// PUT update product
exports.updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const updateData = req.body;

  try {
    if (req.file) {
      updateData.imageUrl = `/images/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    }).populate('category');

    if (!updatedProduct) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// DELETE product
exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};