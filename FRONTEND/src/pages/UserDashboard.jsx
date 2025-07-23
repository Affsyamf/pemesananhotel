// frontend/src/pages/UserDashboard.jsx
import React from 'react';

function UserDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">User Dashboard</h1>
      <p className="mt-4">Selamat datang! Di sini Anda bisa melihat tipe kamar dan melakukan pemesanan.</p>
       <button 
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
export default UserDashboard;