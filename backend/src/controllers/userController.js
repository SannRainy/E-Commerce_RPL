const User = require('../models/User');

// GET all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        next(error); // Melempar error ke middleware
    }
};

// PUT update user role
exports.updateUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        // Koreksi: Validasi disesuaikan dengan skema baru
        if (!['customer', 'admin'].includes(role)) {
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
        next(error);
    }
};

// DELETE user
exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (error) {
        next(error);
    }
};