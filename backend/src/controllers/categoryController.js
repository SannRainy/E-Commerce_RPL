const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil kategori', error });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: 'Gagal membuat kategori', error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deleted = await Category.findByIdAndDelete(categoryId);
    if (!deleted) return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    res.status(200).json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus kategori', error });
  }
};
