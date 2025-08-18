import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import UsersTable from '../components/admin/UsersTable';
import UserFormModal from '../components/admin/UserFormModal';
import ConfirmationModal from '../components/admin/ConfirmationModal';
import Pagination from '../components/admin/Pagination';

function ManageUsersPage() {
   const [pageData, setPageData] = useState({
       data: [],
       totalPages: 1,
       currentPage: 1
   });
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
 
 // State untuk modal form (Tambah/Edit)
 const [isFormModalOpen, setIsFormModalOpen] = useState(false);
 const [editingUser, setEditingUser] = useState(null);

 // State untuk modal konfirmasi hapus
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [userToDelete, setUserToDelete] = useState(null);

   const fetchUsers = useCallback(async (page) => {
       setLoading(true);
       try {
           const token = localStorage.getItem('token');
           const response = await axios.get(`http://localhost:5001/api/admin/users?page=${page}&limit=10`, {
               headers: { Authorization: `Bearer ${token}` }
           });
           setPageData(response.data); // Simpan seluruh objek respon
       } catch (error) {
           toast.error(error.response?.data?.message||'Gagal mengambil data pengguna.');
       } finally {
           setLoading(false);
       }
   }, []);

   useEffect(() => {
       fetchUsers(currentPage);
   }, [currentPage, fetchUsers]);

   const handlePageChange = (page) => {
       setCurrentPage(page);
   };
 
 // Fungsi untuk modal form
 const handleOpenFormModal = (user = null) => {
   setEditingUser(user);
   setIsFormModalOpen(true);
 };

 const handleCloseFormModal = () => {
   setIsFormModalOpen(false);
   setEditingUser(null);
 };
 
 const handleFormSubmit = async (data) => {
   const toastId = toast.loading('Menyimpan data...');
   const token = localStorage.getItem('token');
   try {
       if (editingUser) {
           await axios.put(`http://localhost:5001/api/admin/users/${editingUser.id}`, data, {
               headers: { Authorization: `Bearer ${token}` }
           });
           toast.success('User berhasil diperbarui', { id: toastId });
       } else {
           // Endpoint untuk menambah user baru oleh admin mungkin berbeda, sesuaikan jika perlu
           await axios.post('http://localhost:5001/api/auth/register', data);
           toast.success('User baru berhasil ditambahkan', { id: toastId });
       }
       // PERBAIKAN 2: Kirim currentPage saat fetch ulang
       fetchUsers(currentPage);
       handleCloseFormModal();
   } catch (error) {
       toast.error(error.response?.data?.message || 'Gagal menyimpan data', { id: toastId });
   }
 };

 // Fungsi untuk modal hapus
 const openDeleteModal = (user) => {
   setUserToDelete(user);
   setIsDeleteModalOpen(true);
 };

 const closeDeleteModal = () => {
   setUserToDelete(null);
   setIsDeleteModalOpen(false);
 };
 
 const confirmDelete = async () => {
   if (!userToDelete) return;
   const toastId = toast.loading('Menghapus pengguna...');
   try {
     const token = localStorage.getItem('token');
     await axios.delete(`http://localhost:5001/api/admin/users/${userToDelete.id}`, {
       headers: { Authorization: `Bearer ${token}` }
     });
     toast.success('User berhasil dihapus', { id: toastId });
     // PERBAIKAN 3: Kirim currentPage saat fetch ulang
     fetchUsers(currentPage);
     closeDeleteModal();
   } catch (error) {
     toast.error(error?.response?.data?.message||'Gagal menghapus user', { id: toastId });
   }
 };

 return (
   <div className="container mx-auto p-6 md:p-10">
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manajemen Users</h1>
       <button onClick={() => handleOpenFormModal(null)} className="btn-primary flex items-center">
         <Plus size={20} className="mr-2" />
         Tambah User
       </button>
     </div>
     
     <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
        {loading ? <p className="text-center dark:text-gray-300">Loading...</p> : (
            <>
                {/* PERBAIKAN 1: Gunakan pageData.data, bukan 'users' */}
                <UsersTable data={pageData.data} onEdit={handleOpenFormModal} onDelete={openDeleteModal} />
                <Pagination
                    currentPage={pageData.currentPage}
                    totalPages={pageData.totalPages}
                    onPageChange={handlePageChange}
                />
            </>
        )}
     </div>

     <UserFormModal 
       isOpen={isFormModalOpen} 
       onClose={handleCloseFormModal}
       onSubmit={handleFormSubmit}
       initialData={editingUser}
     />
     
     <ConfirmationModal 
       isOpen={isDeleteModalOpen}
       onClose={closeDeleteModal}
       onConfirm={confirmDelete}
       title="Hapus User"
       message={`Apakah Anda yakin ingin menghapus user "${userToDelete?.username}"? Aksi ini tidak dapat dibatalkan.`}
     />
   </div>
 );
}

export default ManageUsersPage;
