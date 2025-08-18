// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Mencoba masuk...');

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);
      
      const { token, role } = response.data;

      // Simpan token dan role ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      toast.success('Login berhasil!', { id: toastId });

      // --- INI LOGIKA UTAMANYA ---
      // Periksa peran dan arahkan ke dasbor yang sesuai
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      // --- AKHIR LOGIKA UTAMA ---

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal', { id: toastId });
    }
  };

  return (
    <AuthLayout title="Login ke Akun Anda">
      <form onSubmit={handleSubmit} className="space-y-6 dar">
        <div>
          <label className="text-sm font-bold text-gray-900 block">Email</label>
          <input name="email" type="email" onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-slate-900 rounded-md mt-1 dark:text-gray-900" required />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block">Password</label>
          <input name="password" type="password" onChange={handleChange} className="w-full p-2 border border-gray-300  dark:border-slate-900 rounded-md mt-1 dark:text-gray-900" required />
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Lupa password?</Link>
        </div>
        <div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold">Login</button>
        </div>
      </form>
      <p className="text-sm text-center mt-4 dark:text-gray-900">
        Belum punya akun?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">Daftar di sini</Link>
      </p>
      <p className="text-sm text-center mt-4 dark:text-gray-900">
        Kembali ke halaman utama{' '}
        <Link to="/" className="text-blue-600 hover:underline">KLIK</Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;