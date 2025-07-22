// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Halaman Home sederhana untuk testing setelah login
function HomePage() {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold">Selamat Datang!</h1>
      <p className="mt-4">Anda telah berhasil login.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Anda bisa membuat halaman dashboard di sini nanti */}
        <Route path="/dashboard" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;