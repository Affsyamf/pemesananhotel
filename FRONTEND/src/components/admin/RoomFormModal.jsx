// frontend/src/components/admin/RoomFormModal.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function RoomFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { register, handleSubmit, reset } = useForm();
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ name: '', type: '', price: 0, quantity: 0, facilities: '', description: '', image_url: '' });
    }
  }, [initialData, reset]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* ... (Kode backdrop Transition.Child sama seperti UserFormModal) ... */}
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-25" /></Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full dark:bg-gray-800 max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:bg-gray-800 dark:text-gray-200">{isEditMode ? 'Edit Kamar' : 'Tambah Kamar Baru'}</Dialog.Title>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 dark:text-gray-300 dark:bg-gray-800">
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-200 ">Nama Kamar</label><input {...register('name', { required: true })} className="mt-1 w-full input-style dark:bg-gray-800" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipe</label><input {...register('type', { required: true })} className="mt-1 w-full input-style dark:bg-gray-800" placeholder="e.g. Deluxe, Suite" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Harga per Malam</label><input {...register('price', { required: true, valueAsNumber: true })} type="number" className="mt-1 w-full input-style dark:bg-gray-800" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Jumlah Tersedia</label><input {...register('quantity', { required: true, valueAsNumber: true })} type="number" className="mt-1 w-full input-style dark:bg-gray-800" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Image URL</label><input {...register('image_url')} className="mt-1 w-full input-style dark:bg-gray-800" placeholder="https://..." /><p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-gray-800">Untuk saat ini, masukkan link gambar dari internet.</p></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Fasilitas</label><input {...register('facilities')} className="mt-1 w-full input-style dark:bg-gray-800" placeholder="Pisahkan dengan koma, e.g. WiFi, AC, TV" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Deskripsi</label><textarea {...register('description')} rows="3" className="mt-1 w-full input-style dark:bg-gray-800"></textarea></div>

                  <div className="md:col-span-2 mt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
                    <button type="submit" className="btn-primary">Simpan</button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// Tambahkan beberapa style reusable di CSS Anda jika perlu
// Misalnya di src/index.css:
// .input-style { @apply rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border; }
// .btn-primary { @apply inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none; }
// .btn-secondary { @apply inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none; }

export default RoomFormModal;