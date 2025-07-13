import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });

        await User.findByIdAndUpdate(user._id, { isOnline: true });

        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ result: { id: user._id, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
};