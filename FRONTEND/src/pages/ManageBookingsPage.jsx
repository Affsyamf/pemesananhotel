import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import ConfirmationModal from '../components/admin/ConfirmationModal';

function ManageBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5001/api/admin/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message||'Gagal mengambil data pesanan.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const openDeleteModal = (booking) => {
        setBookingToDelete(booking);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setBookingToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!bookingToDelete) return;
        const toastId = toast.loading('Menghapus pesanan...');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/admin/bookings/${bookingToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Pesanan berhasil dihapus.', { id: toastId });
            fetchBookings(); // Refresh data
            closeDeleteModal();
        } catch (error) {
            toast.error(error.response?.data?.message||'Gagal menghapus pesanan.', { id: toastId });
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="container mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">Kelola Semua Pesanan</h1>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="th-style dark:text-white">ID</th>
                                <th className="th-style dark:text-white">Nama Kamar</th>
                                <th className="th-style dark:text-white">Pemesan</th>
                                <th className="th-style dark:text-white">Tanggal Pesan</th>
                                <th className="th-style dark:text-white">Check-in</th>
                                <th className="th-style dark:text-white">Check-out</th>
                                <th className="th-style dark:text-white">Status</th>
                                <th className="th-style dark:text-white">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="8" className="text-center p-4">Memuat data...</td></tr>
                            ) : (
                                bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="td-style font-mono dark:text-white">#{booking.id}</td>
                                        <td className="td-style font-semibold dark:text-white">{booking.room_name}</td>
                                        <td className="td-style dark:text-white">{booking.user_username}</td>
                                        <td className="td-style dark:text-white">{formatDate(booking.created_at)}</td>
                                        <td className="td-style dark:text-white">{formatDate(booking.check_in_date)}</td>
                                        <td className="td-style dark:text-white">{formatDate(booking.check_out_date)}</td>
                                        <td className="td-style dark:text-white">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="td-style">
                                            <button onClick={() => openDeleteModal(booking)} className="text-red-600 hover:text-red-800">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Hapus Pesanan"
                message={`Anda yakin ingin menghapus pesanan #${bookingToDelete?.id} untuk kamar "${bookingToDelete?.room_name}"? Stok kamar akan dikembalikan jika statusnya 'confirmed'.`}
            />
        </div>
    );
}

export default ManageBookingsPage;
