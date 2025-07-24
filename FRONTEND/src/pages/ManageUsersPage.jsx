// frontend/src/pages/ManageUsersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import UsersTable from '../components/admin/UsersTable';
import UserFormModal from '../components/admin/UserFormModal'; // <-- Import modal

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // <-- State untuk data user yg diedit

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengambil data user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Fungsi untuk membuka modal
  const handleOpenModal = (user = null) => {
    setEditingUser(user); // Jika 'user' ada, kita mode edit. Jika null, mode tambah.
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Fungsi untuk mengirim data dari form
  const handleFormSubmit = async (data) => {
    const toastId = toast.loading('Menyimpan data...');
    const token = localStorage.getItem('token');
    try {
        if (editingUser) {
            // Mode Edit (PUT)
            await axios.put(`http://localhost:5001/api/admin/users/${editingUser.id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User berhasil diperbarui', { id: toastId });
        } else {
            // Mode Tambah (POST)
            // Diarahkan ke /register agar password di-hash. 
            // Atau Anda bisa buat endpoint /admin/users baru untuk create user dengan hashing.
            // Untuk sekarang kita gunakan endpoint register
            await axios.post('http://localhost:5001/api/auth/register', data);
            toast.success('User baru berhasil ditambahkan', { id: toastId });
        }
        fetchUsers(); // Refresh data tabel
        handleCloseModal(); // Tutup modal
    } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal menyimpan data', { id: toastId });
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-gray-200 text-gray-800">Manajemen Users</h1>
        {/* Tombol ini sekarang membuka modal untuk tambah user baru */}
        <button onClick={() => handleOpenModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus size={20} className="mr-2" />
          Tambah User
        </button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
           {/* Kirim fungsi handleOpenModal ke tabel untuk tombol edit */}
           <UsersTable data={users} refetch={fetchUsers} onEdit={handleOpenModal} />
        </div>
      )}

      {/* Render komponen modal */}
      <UserFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
      />
    </div>
  );
}

export default ManageUsersPage;