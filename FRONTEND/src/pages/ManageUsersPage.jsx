// frontend/src/pages/ManageUsersPage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import UsersTable from '../components/admin/UsersTable'; 

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Bungkus fungsi fetchUsers dengan useCallback
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      toast.error( error.response?.data?.message ||'Gagal mengambil data user');
    } finally {
      setLoading(false);
    }
  }, []); // <-- 3. Tambahkan array dependensi kosong

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // 4. Tambahkan fetchUsers sebagai dependensi useEffect

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Users</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus size={20} className="mr-2" />
          Tambah User
        </button>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
           {/* Sekarang prop refetch sudah stabil */}
           <UsersTable data={users} refetch={fetchUsers} />
        </div>
      )}
    </div>
  );
}

export default ManageUsersPage;