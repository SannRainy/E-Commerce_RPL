const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Pengguna tidak ditemukan." });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Email atau password salah." });

        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // KOREKSI: Kirim semua data user yang relevan
        const result = {
            _id: user._id,
            id: user._id, // Duplikat untuk konsistensi
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.status(200).json({ result, token });
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar." });

        if (password.length < 6) return res.status(400).json({ message: "Password minimal harus 6 karakter." });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ email: newUser.email, id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // KOREKSI: Kirim semua data user yang relevan
        const result = {
            _id: newUser._id,
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };

        res.status(201).json({ result, token });
    } catch (error) {
        next(error);
    }
};

module.exports = { login, register };