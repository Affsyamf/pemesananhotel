// frontend/src/components/UserLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserNavbar from './UserNavbar';

function UserLayout() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <UserNavbar />
      <main>
        {/* Halaman (Pesan Kamar / Pesanan Saya) akan dirender di sini */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default UserLayout;