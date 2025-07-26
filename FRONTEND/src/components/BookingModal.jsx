// frontend/src/components/BookingModal.jsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function BookingModal({ isOpen, onClose, onSubmit, room }) {
  const { register, handleSubmit, control } = useForm();

  if (!room) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-25" /></Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full dark:bg-gray-800 max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl dark:text-white font-bold leading-6 text-gray-900">Form Pemesanan: {room.name}</Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                  <div><label className="block dark:text-gray-300 text-sm font-medium">Nama Lengkap</label><input {...register('guest_name', { required: true })} className="input-style dark:bg-gray-900 dark:text-gray-100" /></div>
                  <div><label className="block dark:text-gray-300 text-sm font-medium">Alamat</label><textarea {...register('guest_address', { required: true })} className="input-style dark:bg-gray-900 dark:text-gray-100" /></div>
                  <div>
                    <label className="block dark:text-gray-300 text-sm font-medium">Tanggal Booking</label>
                    <Controller control={control} name="booking_date" required render={({ field }) => (
                        <DatePicker placeholderText="Pilih tanggal" onChange={(date) => field.onChange(date)} selected={field.value} className="input-style w-full dark:bg-gray-900 dark:text-gray-100" minDate={new Date()} dateFormat="yyyy-MM-dd" />
                    )} />
                  </div>
                  <div className="mt-6 flex justify-end space-x-2"><button type="button" onClick={onClose} className="btn-secondary">Batal</button><button type="submit" className="btn-primary">Konfirmasi Pesanan</button></div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default BookingModal;