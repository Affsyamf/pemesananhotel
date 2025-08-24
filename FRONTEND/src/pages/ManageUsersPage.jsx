import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import RoomCard from '../components/admin/RoomCard';
import RoomFormModal from '../components/admin/RoomFormModal';
import AdminRoomFilter from '../components/admin/AdminRoomFilter';
import ConfirmationModal from '../components/admin/ConfirmationModal';
import GalleryModal from '../components/admin/GalleryModal';

// --- PERBAIKAN: Deklarasikan apiUrl satu kali di sini ---
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function ManageRoomsPage() {
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', price: { min: null, max: null }, type: 'Semua' });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedRoomForGallery, setSelectedRoomForGallery] = useState(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/admin/rooms`, {
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

  const filteredRooms = useMemo(() => {
    return allRooms.filter(room => {
      if (filters.search && !room.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      // Logika filter harga perlu disesuaikan karena harga sekarang ada di inventaris harian
      // Untuk sementara, kita nonaktifkan filter harga di sisi klien
      // const price = room.price; 
      // const { min, max } = filters.price;
      // if (min !== null && price < min) return false;
      // if (max !== null && price > max) return false;
      if (filters.type !== 'Semua' && room.type !== filters.type) return false;
      return true;
    });
  }, [allRooms, filters]);

  const availableTypes = useMemo(() => [...new Set(allRooms.map(room => room.type))], [allRooms]);

  const handleOpenFormModal = (room = null) => {
    setEditingRoom(room);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingRoom(null);
  };

  const handleOpenGalleryModal = (room) => {
    setSelectedRoomForGallery(room);
    setIsGalleryModalOpen(true);
  };

  const handleCloseGalleryModal = () => {
    setIsGalleryModalOpen(false);
    setSelectedRoomForGallery(null);
  };

  const handleFormSubmit = async (data) => {
    const toastId = toast.loading('Menyimpan data...');
    const token = localStorage.getItem('token');
    try {
      if (editingRoom) {
        const payload = {
            name: data.name,
            type: data.type,
            facilities: data.facilities,
            description: data.description,
        };
        await axios.put(`${apiUrl}/api/admin/rooms/${editingRoom.id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Kamar berhasil diperbarui', { id: toastId });
      } else {
        await axios.post(`${apiUrl}/api/admin/rooms`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Kamar baru berhasil ditambahkan', { id: toastId });
      }
      fetchRooms();
      handleCloseFormModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan data', { id: toastId });
    }
  };

  const openDeleteModal = (room) => {
    setRoomToDelete(room);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setRoomToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    const toastId = toast.loading('Menghapus kamar...');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/api/admin/rooms/${roomToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Kamar berhasil dihapus', { id: toastId });
      fetchRooms();
      closeDeleteModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus kamar', { id: toastId });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manajemen Kamar</h1>
        <button onClick={() => handleOpenFormModal(null)} className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Tambah Kamar
        </button>
      </div>

      <AdminRoomFilter
        filters={filters}
        setFilters={setFilters}
        availableTypes={availableTypes}
      />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-6 text-gray-600 dark:text-gray-400">Menampilkan {filteredRooms.length} dari {allRooms.length} kamar.</p>
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onEdit={handleOpenFormModal} 
                  onDelete={openDeleteModal}
                  onGallery={handleOpenGalleryModal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Tidak ada kamar yang sesuai.</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Coba ubah kriteria filter atau tambahkan kamar baru.</p>
            </div>
          )}
        </>
      )}

      <RoomFormModal 
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        initialData={editingRoom}
      />
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Hapus Kamar"
        message={`Apakah Anda yakin ingin menghapus kamar "${roomToDelete?.name}"? Aksi ini akan menghapus data kamar secara permanen.`}
      />

      <GalleryModal
        isOpen={isGalleryModalOpen}
        onClose={handleCloseGalleryModal}
        room={selectedRoomForGallery}
      />
    </div>
  );
}

export default ManageRoomsPage;
