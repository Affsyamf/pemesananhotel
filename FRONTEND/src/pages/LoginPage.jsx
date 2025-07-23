// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  // const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);
      
      // --- PERBAIKAN DIMULAI DI SINI ---

      // 1. Simpan token DAN role ke localStorage agar aplikasi tahu siapa yang login
       toast.success('Login berhasil!');

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
      navigate('/dashboard');
    } catch (err) {
      // Ganti setError dengan toast.error
      toast.error(err.response?.data?.message || 'Login gagal');
    }
  };

      // --- AKHIR PERBAIKAN ---

  return (
    <AuthLayout title="Login ke Akun Anda">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-bold text-gray-600 block">Email</label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            required
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block">Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
            required
          />
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Lupa Password?
          </Link>
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
          >
            Login
          </button>
        </div>
      </form>
      <p className="text-sm text-center mt-4">
        Belum punya akun?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Daftar di sini
        </Link>
      </p>
      <p className="text-sm text-center mt-4">
        Kembali ke Dashboard{' '}
        <Link to="/" className="text-blue-600 hover:underline">
          Klik
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;