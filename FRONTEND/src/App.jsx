// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Halaman Publik
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import { Toaster } from 'react-hot-toast';

// Halaman Terlindungi
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Router>
        {/* 2. Tambahkan komponen Toaster di sini */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
      />
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rute Terlindungi untuk User */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          {/* Tambahkan rute user lain di sini, misal /booking */}
        </Route>

        {/* Rute Terlindungi untuk Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Tambahkan rute admin lain di sini, misal /admin/users */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;