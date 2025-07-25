// frontend/src/components/admin/UserFormModal.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function UserFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const isEditMode = !!initialData;

  useEffect(() => {
    // Reset form saat data awal berubah (saat membuka modal untuk user berbeda)
    if (initialData) {
      reset(initialData);
    } else {
      reset({ username: '', email: '', password: '', role: 'user' });
    }
  }, [initialData, reset]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full dark:bg-gray-900 max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                  {isEditMode ? 'Edit User' : 'Tambah User Baru'}
                </Dialog.Title>
                
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 dark:bg-gray-900 dark:text-gray-900">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-100 ">Username</label>
                    <input {...register('username', { required: 'Username wajib diisi' })} className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-100">Email</label>
                    <input {...register('email', { required: 'Email wajib diisi' })} type="email" className="mt-1 block w-full rounded-md dark:bg-gray-900 dark:text-gray-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                     {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                   {!isEditMode && ( // Hanya tampilkan field password saat mode Tambah User
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-100">Password</label>
                       <input {...register('password', { required: 'Password wajib diisi' })} type="password" className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                     </div>
                   )}
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-100">Role</label>
                     <select {...register('role')} className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-100 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                     </select>
                  </div>

                  <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none">
                      Batal
                    </button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none">
                      Simpan
                    </button>
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

export default UserFormModal;