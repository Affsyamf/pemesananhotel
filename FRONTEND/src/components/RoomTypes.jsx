import React from 'react';
import { DollarSign } from 'lucide-react'; // Import ikon

function RoomTypes({ rooms, loading }) {

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
            {rooms.map((room) => {
              // Format harga menjadi format Rupiah
              const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(room.price);

              return (
                <div key={room.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
                  <div className="overflow-hidden">
                    <img src={room.image_url || 'https://via.placeholder.com/400x250'} alt={room.name} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{room.name}</h3>
                    
                    {/* --- KODE BARU UNTUK TIPE KAMAR --- */}
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">{room.type}</p>

                    {/* --- KODE BARU UNTUK HARGA --- */}
                    <div className="flex items-center text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                        <DollarSign size={20} className="mr-2"/>
                        <span>{formattedPrice} / malam</span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow min-h-[60px]">{room.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        <span className="font-semibold">Fasilitas:</span> {room.facilities}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default RoomTypes;