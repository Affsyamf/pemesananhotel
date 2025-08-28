import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, BedDouble, DollarSign, ListChecks } from 'lucide-react';
// PERBAIKAN 1: Import Recharts langsung dari library
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Komponen Kartu Statistik (gaya shadcn/ui)
const StatCard = ({ title, value, icon, description }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            {icon}
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
);

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiUrl}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                toast.error(error.response?.data?.messsage||'Gagal memuat data statistik.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // PERBAIKAN 2: Hapus semua logika 'window.Recharts' yang lama
    // Kode if (!Recharts) { ... } dan const { ... } = Recharts; dihapus

    if (loading) return <p className="text-center p-10">Memuat dashboard...</p>;
    if (!stats) return <p className="text-center p-10">Tidak ada data untuk ditampilkan.</p>;

    const formatCurrency = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    return (
        <div className="container mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Dashboard Admin</h1>

            {/* Grid Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total Pengguna" 
                    value={stats.totalUsers}
                    description="Jumlah semua akun pengguna"
                    icon={<Users className="text-blue-500" size={24} />}
                />
                <StatCard 
                    title="Total Pesanan" 
                    value={stats.totalBookings}
                    description="Jumlah semua pesanan terkonfirmasi"
                    icon={<ListChecks className="text-green-500" size={24} />}
                />
                <StatCard 
                    title="Pendapatan Bulan Ini" 
                    value={formatCurrency(stats.monthlyRevenue)}
                    description={`Total pendapatan di bulan ${new Date().toLocaleString('id-ID', { month: 'long' })}`}
                    icon={<DollarSign className="text-yellow-500" size={24} />}
                />
            </div>

            {/* Grid Grafik dan Pesanan Terbaru */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Grafik Pendapatan */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Pendapatan 6 Bulan Terakhir</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.monthlyRevenueChart}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                            <YAxis tickFormatter={(value) => `Rp ${value/1000000} Jt`} tick={{ fill: '#6b7280' }} />
                            <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                            <Legend />
                            <Bar dataKey="revenue" fill="#3b82f6" name="Pendapatan" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pesanan Terbaru */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">Pesanan Terbaru</h3>
                    <div className="space-y-4">
                        {stats.recentBookings.map(booking => (
                            <div key={booking.id} className="flex items-center">
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mr-4">
                                    <BedDouble className="text-gray-500" size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold dark:text-gray-200">{booking.room_name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        oleh {booking.user_username} pada {formatDate(booking.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
