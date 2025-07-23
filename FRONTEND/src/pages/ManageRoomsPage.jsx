import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

// Nanti kita akan buat komponen tabel dan modal untuk kamar
// import RoomsTable from '../components/admin/RoomsTable'; 
// import RoomFormModal from '../components/admin/RoomFormModal';

function ManageRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Kamar</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus size={20} className="mr-2" />
          Tambah Kamar
        </button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl mb-4">Data Kamar</h2>
           {/* Untuk sementara, kita tampilkan data mentah untuk memastikan API berjalan */}
           <pre className="bg-gray-100 p-4 rounded-md text-sm">
             {JSON.stringify(rooms, null, 2)}
           </pre>
           {/* Nanti di sini akan ada komponen <RoomsTable /> */}
        </div>
      )}
    </div>
  );
}

export default ManageRoomsPage;