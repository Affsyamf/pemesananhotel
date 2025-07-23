import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import RoomCard from '../components/admin/RoomCard';
import RoomFormModal from '../components/admin/RoomFormModal';

// Nanti kita akan buat komponen tabel dan modal untuk kamar
// import RoomsTable from '../components/admin/RoomsTable'; 
// import RoomFormModal from '../components/admin/RoomFormModal';

function ManageRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Data dari API:', response.data); 
      
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
            toast.error(error.response?.data?.message  || 'Gagal menghapus kamar');
        }
    }
  }

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
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map(room => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
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