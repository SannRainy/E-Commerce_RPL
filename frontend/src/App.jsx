import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const isAdmin = user?.result?.role === 'admin';

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/profile" element={user && !isAdmin ? <ProfilePage /> : <Navigate to="/login" />} />
                <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;