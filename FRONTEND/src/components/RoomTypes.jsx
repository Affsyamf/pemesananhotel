// frontend/src/components/RoomTypes.jsx
import React from 'react';

// Terima 'rooms' dan 'loading' sebagai props
function RoomTypes({ rooms, loading }) {
  // Data statis 'const rooms = [...]' sudah dihapus

  return (
    <section id="rooms" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            Tipe Kamar Kami
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Temukan Ruang Sempurna Anda</p>
        </div>

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">Memuat data kamar...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">Saat ini belum ada kamar yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gunakan data dari props untuk me-render kartu */}
            {rooms.map((room) => (
              <div key={room.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
                <div className="overflow-hidden">
                  {/* Ganti dari room.img menjadi room.image_url */}
                  <img src={room.image_url || 'https://via.placeholder.com/400x250'} alt={room.name} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{room.name}</h3>
                  {/* Tampilkan deskripsi dan fasilitas dari data dinamis */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm h-16">{room.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Fasilitas: {room.facilities}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RoomTypes;