import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(formData);
            localStorage.setItem('profile', JSON.stringify(data));
            if (data.result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
            window.location.reload();
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg"/>
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 mb-4 border rounded-lg"/>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;