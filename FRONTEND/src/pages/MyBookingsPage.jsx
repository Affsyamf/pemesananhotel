import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Printer, XCircle } from 'lucide-react';
import ConfirmationModal from '../components/admin/ConfirmationModal';

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

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

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setBookingToCancel(null);
    setIsCancelModalOpen(false);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    const toastId = toast.loading('Memproses pembatalan...');
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/bookings/${bookingToCancel.id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pesanan berhasil dibatalkan', { id: toastId });
      fetchMyBookings();
      closeCancelModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membatalkan pesanan', { id: toastId });
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Riwayat Pesanan Saya</h1>
        
      {loading ? <p className="dark:text-gray-300">Memuat riwayat pesanan...</p> : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Anda belum memiliki pesanan.</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Mari jelajahi dan pesan kamar impian Anda!</p>
            <Link to="/dashboard/book" className="btn-primary mt-6">Lihat Kamar</Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="th-style dark:text-gray-100">ID Pesanan</th>
                            <th className="th-style dark:text-gray-100">Nama Kamar</th>
                            <th className="th-style dark:text-gray-100">Tanggal Booking</th>
                            <th className="th-style dark:text-gray-100">Status</th>
                            <th className="th-style dark:text-gray-100">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {bookings.map(booking => (
                            <tr key={booking.id}>
                                <td className="td-style font-mono dark:text-gray-300">#{booking.id}</td>
                                <td className="td-style font-semibold text-gray-800 dark:text-gray-200">{booking.room_name}</td>
                                <td className="td-style dark:text-gray-300">{new Date(booking.booking_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="td-style">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="td-style">
                                    {booking.status === 'confirmed' && (
                                        <div className="flex items-center space-x-4">
                                            <Link to={`/print-booking/${booking.id}`} className="text-blue-600 hover:text-blue-800 flex items-center text-sm dark:text-blue-400 dark:hover:text-blue-300">
                                                <Printer size={16} className="mr-1" />
                                                Cetak
                                            </Link>
                                            <button onClick={() => openCancelModal(booking)} className="text-red-600 hover:text-red-800 flex items-center text-sm dark:text-red-400 dark:hover:text-red-300">
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

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={confirmCancel}
        title="Batalkan Pesanan"
        message={`Apakah Anda yakin ingin membatalkan pesanan untuk kamar "${bookingToCancel?.room_name}"? Aksi ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}

export default MyBookingsPage;