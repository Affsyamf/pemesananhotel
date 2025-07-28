import React from 'react';

const AllBookingsReport = React.forwardRef(({ bookings }, ref) => {
  return (
    <div ref={ref} className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Laporan Riwayat Pesanan</h1>
      <p className="text-center text-sm text-gray-500 mb-6">
        Dicetak pada: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nama Tamu</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Kamar</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tanggal Booking</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td className="px-4 py-2 text-sm text-gray-800">#{booking.id}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{booking.guest_name}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{booking.room_name}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{new Date(booking.booking_date).toLocaleDateString('id-ID')}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default AllBookingsReport;