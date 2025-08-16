import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserRoomCard from '../components/UserRoomCard';
import BookingModal from '../components/BookingModal';
import RoomFilter from '../components/RoomFilter'; // <-- Import komponen filter

function BookRoomPage() {
  const [allRooms, setAllRooms] = useState([]); // Menyimpan semua kamar dari API
  const [loading, setLoading] = useState(true);
  
  // State untuk filter
  const [filters, setFilters] = useState({
    price: { min: null, max: null },
    type: 'Semua',
    facilities: [],
  });
  
  // State untuk modal booking
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchAllRooms = async () => {
    try {
      setLoading(true);
      // PERUBAHAN 1: Menambahkan /public/ ke URL
      const response = await axios.get('http://localhost:5001/api/public/rooms');
      setAllRooms(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message||'Gagal mengambil data kamar');
    } finally {
      setLoading(false);
    }
  };

  // Ambil data kamar sekali saja saat komponen dimuat
  useEffect(() => {
    fetchAllRooms();
  }, []);

  // Logika untuk menyaring kamar berdasarkan state `filters`
  const filteredRooms = useMemo(() => {
    return allRooms.filter(room => {
      // Filter harga
      const price = room.price;
      const { min, max } = filters.price;
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;

      // Filter tipe
      if (filters.type !== 'Semua' && room.type !== filters.type) return false;

      // Filter fasilitas
      if (filters.facilities.length > 0) {
        const roomFacilities = room.facilities ? room.facilities.split(',').map(f => f.trim()) : [];
        const hasAllFacilities = filters.facilities.every(facility => roomFacilities.includes(facility));
        if (!hasAllFacilities) return false;
      }
      
      return true;
    });
  }, [allRooms, filters]);

  // Ekstrak tipe dan fasilitas unik dari semua kamar untuk opsi filter
  const availableTypes = useMemo(() => [...new Set(allRooms.map(room => room.type))], [allRooms]);
  const availableFacilities = useMemo(() => {
      const allFacilities = new Set();
      allRooms.forEach(room => {
          if (room.facilities) {
              room.facilities.split(',').map(f => f.trim()).forEach(facility => allFacilities.add(facility));
          }
      });
      return [...allFacilities];
  }, [allRooms]);


  // --- Logika untuk Booking Modal (tidak berubah) ---
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
      // PERUBAHAN 2: Menambahkan /public/ ke URL
      await axios.post('http://localhost:5001/api/public/bookings', 
        { ...data, room_id: selectedRoom.id, booking_date: formattedDate }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Pemesanan Anda berhasil!', { id: toastId });
      handleCloseModal();
      // Panggil fungsi fetchAllRooms yang sudah diperbarui
      fetchAllRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat pesanan', { id: toastId });
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 dark:text-gray-200">Pilih Kamar Impian Anda</h1>
      
      {/* Tampilkan komponen filter di sini */}
      <RoomFilter 
        filters={filters} 
        setFilters={setFilters}
        availableTypes={availableTypes}
        availableFacilities={availableFacilities}
      />
      
      {loading ? (
        <p>Memuat kamar...</p>
      ) : (
        <>
          <p className="mb-6 text-gray-600 dark:text-gray-200">Menampilkan {filteredRooms.length} dari {allRooms.length} kamar.</p>
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map(room => (
                <UserRoomCard key={room.id} room={room} onBook={handleOpenModal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold text-gray-700">Tidak ada kamar yang sesuai dengan filter Anda.</h3>
              <p className="text-gray-500 mt-2">Coba ubah atau reset kriteria filter Anda.</p>
            </div>
          )}
        </>
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
