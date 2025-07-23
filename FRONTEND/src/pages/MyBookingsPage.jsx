// frontend/src/pages/UserDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, BedDouble, DollarSign, Printer } from 'lucide-react';

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message ||'Gagal mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Riwayat Pesanan Saya</h1>
            <button onClick={handleLogout} className="btn-secondary mt-4 md:mt-0">Logout</button>
        </div>
        
        {loading ? (
          <p>Memuat riwayat pesanan...</p>
        ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700">Anda belum memiliki pesanan.</h3>
                <p className="text-gray-500 mt-2">Mari jelajahi dan pesan kamar impian Anda!</p>
                <Link to="/" className="btn-primary mt-6">Lihat Kamar</Link>
            </div>
        ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="th-style">ID Pesanan</th>
                                <th className="th-style">Nama Kamar</th>
                                <th className="th-style">Tanggal Booking</th>
                                <th className="th-style">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="td-style font-mono">#{booking.id}</td>
                                    <td className="td-style font-semibold text-gray-800">{booking.room_name}</td>
                                    <td className="td-style">{new Date(booking.booking_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                    <td className="td-style">
                                        <Link to={`/print-booking/${booking.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                                            <Printer size={18} className="mr-2" />
                                            Cetak
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

// Tambahkan style untuk tabel di index.css
// .th-style { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
// .td-style { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-600; }
export default MyBookingsPage;