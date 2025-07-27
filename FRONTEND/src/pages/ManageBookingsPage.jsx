import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import BookingsTable from '../components/admin/BookingsTable';
import ConfirmationModal from '../components/admin/ConfirmationModal';
import AllBookingsReport from '../components/admin/AllBookingsReport';

function ManageBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const reportRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: 'Laporan-Pemesanan-Hotel-Mewah',
    onAfterPrint: () => toast.success('Laporan berhasil dibuat'),
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      toast.error('Gagal mengambil data pesanan');
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
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/admin/bookings/${bookingToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pesanan berhasil dihapus');
      fetchBookings();
      closeDeleteModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus pesanan');
    }
  };

  return (
    <div>
      <div className="main-content">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Riwayat Semua Pesanan</h1>
          <button onClick={handlePrint} className="btn-secondary flex items-center">
            <Printer size={18} className="mr-2" />
            Cetak Laporan
          </button>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <BookingsTable data={bookings} onDelete={openDeleteModal} />
          </div>
        )}
      </div>

      <div className="printable-content">
        <AllBookingsReport ref={reportRef} bookings={bookings} />
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Hapus Pesanan"
        message={`Apakah Anda yakin ingin menghapus pesanan #${bookingToDelete?.id} oleh "${bookingToDelete?.guest_name}"? Stok kamar akan dikembalikan jika status 'confirmed'.`}
      />
    </div>
  );
}

export default ManageBookingsPage;