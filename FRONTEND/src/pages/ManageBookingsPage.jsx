// frontend/src/pages/ManageBookingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BookingsTable from '../components/admin/BookingsTable';

function ManageBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/bookings', {
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
    fetchBookings();
  }, [fetchBookings]);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus permanen pesanan ini? Stok kamar akan dikembalikan jika status 'confirmed'.")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5001/api/admin/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Pesanan berhasil dihapus');
        fetchBookings();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal menghapus pesanan');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Riwayat Semua Pesanan</h1>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
           <BookingsTable data={bookings} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}

export default ManageBookingsPage;