// frontend/src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';

function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);
      
      // Cek apakah rolenya admin
      if (response.data.role !== 'admin') {
        toast.error('Akses ditolak. Akun ini bukan admin.');
        return;
      }

      toast.success('Login admin berhasil!');
      // Simpan token dan role
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
    //   alert('Login admin berhasil!');
      navigate('/admin/dashboard'); // Arahkan ke dasbor admin
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <AuthLayout title="Admin Login">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <label className="text-sm font-bold text-gray-600 block">Email</label>
          <input name="email" type="email" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" required />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block">Password</label>
          <input name="password" type="password" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md mt-1" required />
        </div>
        <div>
          <button type="submit" className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold">
            Login as Admin
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default AdminLoginPage;