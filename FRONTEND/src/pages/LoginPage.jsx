// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

function LoginPage() {
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
      
      // --- PERBAIKAN DIMULAI DI SINI ---

      // 1. Simpan token DAN role ke localStorage agar aplikasi tahu siapa yang login
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      alert('Login berhasil!');
      
      // 2. Arahkan ke dasbor user ("/dashboard"), BUKAN ke halaman utama ("/")
      navigate('/dashboard'); 

      // --- AKHIR PERBAIKAN ---

    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <AuthLayout title="Login ke Akun Anda">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
    </AuthLayout>
  );
}

export default LoginPage;