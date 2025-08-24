import React, { useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';

function RoomFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { register, handleSubmit, reset } = useForm();
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
          reset(initialData);
        } else {
          // Nilai default untuk kamar baru
          reset({ name: '', type: '', price: '', quantity: '', facilities: '', description: '', image_url: '' });
        }
    }
  }, [initialData, isOpen, reset]);

  // Bungkus onSubmit untuk mereset form setelahnya
  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full dark:bg-gray-800 max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">
                    {isEditMode ? 'Edit Detail Kamar' : 'Tambah Kamar Baru'}
                </Dialog.Title>
                
                <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label-style">Nama Kamar</label>
                    <input {...register('name', { required: true })} className="mt-1 w-full input-style dark:bg-slate-900 dark:text-white text-slate-900" />
                  </div>
                  
                  <div>
                    <label className="label-style">Tipe</label>
                    <input {...register('type', { required: true })} className="mt-1 w-full input-style dark:bg-slate-900 dark:text-white text-slate-900"  placeholder="e.g. Deluxe, Suite " />
                  </div>

                  {/* --- PERBAIKAN UTAMA DI SINI --- */}
                  {/* Input ini sekarang hanya muncul saat menambah kamar baru */}
                  {!isEditMode && (
                    <>
                        <div>
                            <label className="label-style">Harga Awal per Malam</label>
                            <input {...register('price', { required: true, valueAsNumber: true })} type="number" className="mt-1 w-full input-style dark:bg-slate-900 dark:text-white text-slate-900" />
                        </div>
                        <div>
                            <label className="label-style">Kuantitas Awal per Hari</label>
                            <input {...register('quantity', { required: true, valueAsNumber: true })} type="number" className="mt-1 w-full input-style dark:bg-slate-900 dark:text-white text-slate-900" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label-style">Image URL (Opsional)</label>
                            <input {...register('image_url')} className="mt-1 w-full input-style dark:bg-slate-900 dark:text-white text-slate-900" placeholder="https://..." />
                        </div>
                    </>
                  )}
                  
                  <div className="md:col-span-2">
                    <label className="label-style">Fasilitas</label>
                    <input {...register('facilities')} className="mt-1 w-full input-style dark:bg-slate-900 dark:text-white text-slate-900" placeholder="Pisahkan dengan koma, e.g. WiFi, AC, TV" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="label-style">Deskripsi</label>
                    <textarea {...register('description')} rows="3" className="mt-1 w-full input-style dark:bg-slate-900 dark:text-white text-slate-900"></textarea>
                  </div>

                  {isEditMode && (
                    <p className="text-xs dark:bg-slate-900 dark:text-white text-slate-900 md:col-span-2">
                        Harga, kuantitas, dan gambar diatur di halaman "Kelola Inventaris" dan "Kelola Galeri".
                    </p>
                  )}

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

export default RoomFormModal;
