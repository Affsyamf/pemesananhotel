import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Printer, XCircle, CreditCard } from 'lucide-react';
import ConfirmationModal from '../components/admin/ConfirmationModal';
import Pagination from '../components/admin/Pagination';

// --- PERBAIKAN: Deklarasikan apiUrl satu kali di sini ---
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function MyBookingsPage() {
  const [pageData, setPageData] = useState({ data: [], totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const fetchMyBookings = useCallback(async (page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // PERBAIKAN: Hapus 'S' yang salah dari URL
      const response = await axios.get(`${apiUrl}/api/public/my-bookings?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPageData(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengambil data pesanan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBookings(currentPage);
  }, [currentPage, fetchMyBookings]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      await axios.put(`${apiUrl}/api/public/bookings/${bookingToCancel.id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pesanan berhasil dibatalkan', { id: toastId });
      fetchMyBookings(currentPage);
      closeCancelModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membatalkan pesanan', { id: toastId });
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Riwayat Pesanan Saya</h1>
        
      {loading ? <p className="dark:text-gray-300">Memuat riwayat pesanan...</p> : !pageData.data || pageData.data.length === 0 ? (
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
                            <th className="th-style dark:text-gray-100 text-center">Pesanan Ke-#</th>
                            <th className="th-style dark:text-gray-100 text-center">Nama Kamar</th>
                            <th className="th-style dark:text-gray-100 text-center">Tanggal Pesan</th>
                            <th className="th-style dark:text-gray-100 text-center">Check-in</th>
                            <th className="th-style dark:text-gray-100 text-center">Check-out</th>
                            <th className="th-style dark:text-gray-100 text-center">Pembayaran</th>
                            <th className="th-style dark:text-gray-100 text-center">Status Pesanan</th>
                            <th className="th-style dark:text-gray-100 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {pageData.data.map(booking => (
                            <tr key={booking.id}>
                                <td className="td-style font-mono dark:text-white text-center">#{booking.user_booking_sequence}</td>
                                <td className="td-style font-semibold text-gray-800 dark:text-gray-200 text-center">{booking.room_name}</td>
                                <td className="td-style dark:text-white text-center">{formatDate(booking.created_at)}</td>
                                <td className="td-style dark:text-white text-center">{formatDate(booking.check_in_date)}</td>
                                <td className="td-style dark:text-white text-center">{formatDate(booking.check_out_date)}</td>
                                <td className="td-style text-center">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {booking.payment_status === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                                    </span>
                                </td>
                                <td className="td-style text-center">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'cancelled' || booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        booking.status === 'awaiting_payment' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {booking.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="td-style">
                                    <div className="flex items-center justify-center space-x-4">
                                        {booking.status === 'awaiting_payment' && (
                                            <Link to={`/pay/${booking.id}`} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-semibold dark:text-blue-400 dark:hover:text-blue-300">
                                                <CreditCard size={16} className="mr-1" />
                                                Bayar
                                            </Link>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <Link to={`/print-booking/${booking.id}`} className="text-blue-600 hover:text-blue-800 flex items-center text-sm dark:text-blue-400 dark:hover:text-blue-300">
                                                <Printer size={16} className="mr-1" />
                                                Cetak
                                            </Link>
                                        )}
                                        {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                                            <button onClick={() => openCancelModal(booking)} className="text-red-600 hover:text-red-800 flex items-center text-sm dark:text-red-400 dark:hover:text-red-300">
                                                <XCircle size={16} className="mr-1" />
                                                Batalkan
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={pageData.currentPage}
                totalPages={pageData.totalPages}
                onPageChange={handlePageChange}
            />
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
