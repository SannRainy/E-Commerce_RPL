const Product = require('../models/Product');

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk', error });
  }
};

// GET single product
exports.getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate('category');
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk', error });
  }
};

// POST create product
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  try {
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      imageUrl
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Gagal menambahkan produk', error });
  }
};

// PUT update product
exports.updateProduct = async (req, res) => {
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
    res.status(400).json({ message: 'Gagal mengubah produk', error });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk', error });
  }
};
