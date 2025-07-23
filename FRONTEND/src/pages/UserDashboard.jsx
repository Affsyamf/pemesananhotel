// frontend/src/pages/UserDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserRoomCard from '../components/UserRoomCard';
import BookingModal from '../components/BookingModal';

function UserDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/rooms');
      setRooms(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message  ||'Gagal mengambil data kamar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleOpenModal = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleBookingSubmit = async (data) => {
    const toastId = toast.loading('Memproses pesanan...');
    const token = localStorage.getItem('token');
    
    // Format tanggal agar sesuai dengan MySQL (YYYY-MM-DD)
    const formattedDate = data.booking_date.toISOString().split('T')[0];

    try {
      await axios.post('http://localhost:5001/api/bookings', 
        { ...data, room_id: selectedRoom.id, booking_date: formattedDate }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Pemesanan Anda berhasil!', { id: toastId });
      handleCloseModal();
      fetchRooms(); // Ambil ulang data kamar untuk update jumlah tersedia
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat pesanan', { id: toastId });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Pilih Kamar Impian Anda</h1>
            <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="btn-secondary">Logout</button>
        </div>
        
        {loading ? (
          <p>Memuat kamar...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map(room => (
              <UserRoomCard key={room.id} room={room} onBook={handleOpenModal} />
            ))}
          </div>
        )}
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleBookingSubmit}
        room={selectedRoom}
      />
    </div>
  );
}

export default UserDashboard;