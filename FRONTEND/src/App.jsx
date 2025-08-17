// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ManageBookingsPage from './pages/ManageBookingsPage';

// Halaman Admin
import AdminPrintBookingPage from './pages/AdminPrintBookingPage';
// Halaman Publik
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Halaman & Komponen Terlindungi
import ProtectedRoute from './components/ProtectedRoute';
import UserLayout from './components/UserLayout';
import BookRoomPage from './pages/BookRoomPage';
import MyBookingsPage from './pages/MyBookingsPage';
import PrintBookingPage from './pages/PrintBookingPage'; 
import AdminLayout from './components/admin/AdminLayout';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageRoomsPage from './pages/ManageRoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import ManageAvailabilityPage from './pages/ManageAvailabilityPage';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
        <Route path="/" element={<BookRoomPage />} /> {/* Atau path Anda untuk daftar kamar */}
        <Route path="/rooms/:roomId" element={<RoomDetailPage />} /> {/* <-- Tambahkan rute ini */}

        {/* --- RUTE USER YANG DIPERBARUI --- */}
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route element={<UserLayout />}>
            {/* INI KUNCINYA: Saat user ke /dashboard, langsung arahkan ke "book" */}
            <Route index element={<Navigate to="book" replace />} />
            <Route path="book" element={<BookRoomPage />} />
            <Route path="my-bookings" element={<MyBookingsPage />} />
            <Route path="rooms/:roomId" element={<RoomDetailPage />} />
          </Route>
        </Route>

         {/* Rute Cetak terpisah untuk Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/print-booking/:bookingId" element={<AdminPrintBookingPage />} />
        </Route>
        
        {/* Rute Cetak terpisah agar tidak ada navbar */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/print-booking/:bookingId" element={<PrintBookingPage />} />
        </Route>

        {/* Rute Admin (tidak berubah) */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<ManageUsersPage />} />
            <Route path="rooms" element={<ManageRoomsPage />} />
            <Route path="availability" element={<ManageAvailabilityPage />} />
            <Route path="bookings" element={<ManageBookingsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;