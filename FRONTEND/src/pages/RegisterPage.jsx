// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Tampilkan notifikasi loading
    const toastId = toast.loading('Mendaftarkan akun...');

    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', formData);
      toast.success(response.data.message + '. Anda akan dialihkan ke halaman login...', { id: toastId  });
     
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal', {id: toastId   });
    }
  };

  return (
    <AuthLayout title="Buat Akun Baru">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-bold text-gray-600 block">Username</label>
          <input
            name="username"
            type="text"
            onChange={handleChange}
            className="w-full p-2 border border-slate-900 rounded-md mt-1 dark:text-slate-900"
            required
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block">Email</label>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            className="w-full p-2 border  border-slate-900 dark:text-slate-900 rounded-md mt-1"
            required
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-600 block">Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="w-full p-2 border  border-slate-900 dark:text-slate-900 rounded-md mt-1"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
          >
            Daftar
          </button>
        </div>
      </form>
      <p className="text-sm text-center mt-4 dark:text-slate-900 font-bold">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login di sini
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;