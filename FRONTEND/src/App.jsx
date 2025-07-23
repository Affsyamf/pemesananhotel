// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Komponen dan Halaman
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './pages/UserDashboard';

// Impor untuk Admin
import AdminLayout from './components/admin/AdminLayout';
import ManageUsersPage from './pages/ManageUsersPage';
// import ManageRoomsPage from './pages/ManageRoomsPage'; // <-- Buat ini selanjutnya

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rute Terlindungi untuk User */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Rute Terlindungi untuk Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            {/* Redirect dari /admin ke /admin/users */}
            <Route index element={<Navigate to="users" replace />} /> 
            <Route path="users" element={<ManageUsersPage />} />
            {/* <Route path="rooms" element={<ManageRoomsPage />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;