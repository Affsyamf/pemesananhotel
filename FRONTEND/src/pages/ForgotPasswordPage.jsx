import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import toast from 'react-hot-toast';

function ForgotPasswordPage() {
    const [formData, setFormData] = useState({ email: '', newPassword: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Memproses permintaan...');
        try {
            const response = await axios.post('http://localhost:5001/api/auth/forgot-password', formData);
            toast.success(response.data.message, { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal memperbarui password', { id: toastId });
        }
    };

    return (
        <AuthLayout title="Reset Password Anda">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Terdaftar</label>
                    <input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        className="input-style w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Baru</label>
                    <input
                        name="newPassword"
                        type="password"
                        onChange={handleChange}
                        className="input-style w-full"
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="btn-primary w-full"
                    >
                        Reset Password
                    </button>
                </div>
            </form>
            <p className="text-sm text-center mt-4">
                Ingat password Anda?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Kembali ke Login
                </Link>
            </p>
        </AuthLayout>
    );
}

export default ForgotPasswordPage;