// frontend/src/pages/MyBookingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // <-- PASTIKAN 'Link' DI-IMPORT DI SINI
import { Printer, XCircle } from 'lucide-react';

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message||'Gagal mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      const toastId = toast.loading('Memproses pembatalan...');
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5001/api/bookings/${bookingId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Pesanan berhasil dibatalkan', { id: toastId });
        fetchMyBookings();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal membatalkan pesanan', { id: toastId });
      }
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Riwayat Pesanan Saya</h1>
        
      {loading ? <p>Memuat riwayat pesanan...</p> : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700">Anda belum memiliki pesanan.</h3>
            <p className="text-gray-500 mt-2">Mari jelajahi dan pesan kamar impian Anda!</p>
            <Link to="/dashboard/book" className="btn-primary mt-6">Lihat Kamar</Link>
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
                            <th className="th-style">Status</th>
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
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="td-style">
                                    {booking.status === 'confirmed' && (
                                        <div className="flex items-center space-x-4">
                                            <Link to={`/print-booking/${booking.id}`} className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                                                <Printer size={16} className="mr-1" />
                                                Cetak
                                            </Link>
                                            <button onClick={() => handleCancelBooking(booking.id)} className="text-red-600 hover:text-red-800 flex items-center text-sm">
                                                <XCircle size={16} className="mr-1" />
                                                Batalkan
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;