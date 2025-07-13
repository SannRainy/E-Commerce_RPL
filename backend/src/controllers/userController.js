const User = require('../models/User');

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data users', error });
    }
};

// PUT update user role
exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['customer', 'seller', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Role tidak valid' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengubah role user', error });
    }
};

// DELETE user
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus user', error });
    }
};
