// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    // Jika tidak ada token, arahkan ke halaman login
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Jika ada role yang diizinkan, tapi role user tidak termasuk
    // Arahkan ke halaman "unauthorized" atau kembali ke halaman utama
    return <Navigate to="/" />; 
  }

  // Jika token ada dan role sesuai (atau tidak ada role spesifik yang dibutuhkan)
  return <Outlet />; // Tampilkan komponen halaman (misal: AdminDashboard)
};

export default ProtectedRoute;