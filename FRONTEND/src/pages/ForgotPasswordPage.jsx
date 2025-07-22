// frontend/src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

function ForgotPasswordPage() {
    const [formData, setFormData] = useState({ email: '', newPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://localhost:5001/api/auth/forgot-password', formData);
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal memperbarui password');
        }
    };

    return (
        <AuthLayout title="Reset Password Anda">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}
                <div>
                    <label className="text-sm font-bold text-gray-600 block">Email Terdaftar</label>
                    <input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md mt-1"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-600 block">Password Baru</label>
                    <input
                        name="newPassword"
                        type="password"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md mt-1"
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
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