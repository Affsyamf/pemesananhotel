// frontend/src/pages/AdminDashboard.jsx
import React from 'react';

function AdminDashboard() {
  // Nanti di sini akan ada logika untuk fetch data user dan kamar
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-red-600">Admin Dashboard</h1>
      <p className="mt-4">Di sini Anda bisa mengelola (CRUD) data user dan kamar.</p>
      <button 
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
export default AdminDashboard;