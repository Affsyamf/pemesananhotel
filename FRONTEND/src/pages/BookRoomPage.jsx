// frontend/src/pages/BookRoomPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserRoomCard from '../components/UserRoomCard';
import BookingModal from '../components/BookingModal';

function BookRoomPage() {
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
      toast.error(error.response?.data?.message || 'Gagal mengambil data kamar');
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
    const formattedDate = data.booking_date.toISOString().split('T')[0];

    try {
      await axios.post('http://localhost:5001/api/bookings', 
        { ...data, room_id: selectedRoom.id, booking_date: formattedDate }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Pemesanan Anda berhasil!', { id: toastId });
      handleCloseModal();
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat pesanan', { id: toastId });
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Pilih Kamar Impian Anda</h1>
      {loading ? (
        <p>Memuat kamar...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map(room => (
            <UserRoomCard key={room.id} room={room} onBook={handleOpenModal} />
          ))}
        </div>
      )}
      <BookingModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleBookingSubmit}
        room={selectedRoom}
      />
    </div>
  );
}

export default BookRoomPage;