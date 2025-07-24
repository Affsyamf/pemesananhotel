// frontend/src/pages/ManageRoomsPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import RoomCard from '../components/admin/RoomCard';
import RoomFormModal from '../components/admin/RoomFormModal';
import AdminRoomFilter from '../components/admin/AdminRoomFilter'; // <-- Import filter admin

function ManageRoomsPage() {
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk filter
  const [filters, setFilters] = useState({
    search: '',
    price: { min: null, max: null },
    type: 'Semua',
  });

  // State untuk modal (tidak berubah)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const fetchRooms = useCallback(async () => {
    // ... (fungsi fetchRooms tidak berubah)
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllRooms(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengambil data kamar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Logika untuk menyaring kamar berdasarkan state `filters`
  const filteredRooms = useMemo(() => {
    return allRooms.filter(room => {
      // Filter Pencarian Nama
      if (filters.search && !room.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filter Harga
      const price = room.price;
      const { min, max } = filters.price;
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;

      // Filter Tipe
      if (filters.type !== 'Semua' && room.type !== filters.type) return false;
      
      return true;
    });
  }, [allRooms, filters]);
  
  // Ekstrak tipe unik dari semua kamar untuk opsi filter
  const availableTypes = useMemo(() => [...new Set(allRooms.map(room => room.type))], [allRooms]);

  // --- Semua fungsi handler (handleOpenModal, handleCloseModal, handleDelete, handleFormSubmit) tidak berubah ---
  const handleOpenModal = (room = null) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus kamar ini?")) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/admin/rooms/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Kamar berhasil dihapus');
            fetchRooms();
        } catch (error) {
            toast.error(error.response?.data?.message||'Gagal menghapus kamar');
        }
    }
  };
  const handleFormSubmit = async (data) => {
    const toastId = toast.loading('Menyimpan data...');
    const token = localStorage.getItem('token');
    try {
        if (editingRoom) {
            await axios.put(`http://localhost:5001/api/admin/rooms/${editingRoom.id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Kamar berhasil diperbarui', { id: toastId });
        } else {
            await axios.post('http://localhost:5001/api/admin/rooms', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Kamar baru berhasil ditambahkan', { id: toastId });
        }
        fetchRooms();
        handleCloseModal();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal menyimpan data', { id: toastId });
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Kamar</h1>
        <button onClick={() => handleOpenModal(null)} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Tambah Kamar
        </button>
      </div>

      {/* Render komponen filter di sini */}
      <AdminRoomFilter
        filters={filters}
        setFilters={setFilters}
        availableTypes={availableTypes}
      />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-6 text-gray-600">Menampilkan {filteredRooms.length} dari {allRooms.length} kamar.</p>
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Gunakan `filteredRooms` untuk me-render kartu */}
              {filteredRooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Tidak ada kamar yang sesuai.</h3>
              <p className="text-gray-500 mt-2">Coba ubah kriteria filter atau tambahkan kamar baru.</p>
            </div>
          )}
        </>
      )}

      <RoomFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingRoom}
      />
    </div>
  );
}

export default ManageRoomsPage;