import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Package, BedDouble, Eye } from 'lucide-react';

function UserRoomCard({ room, onBook, numberOfNights }) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(room.price);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <img 
        src={room.image_url || 'https://placehold.co/400x250/e2e8f0/64748b?text=Gambar+Kamar'} 
        alt={room.name} 
        className="w-full h-56 object-cover" 
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x250/e2e8f0/64748b?text=Gambar+Gagal+Dimuat'; }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold dark:text-white text-gray-900">{room.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{room.type}</p>
        
         <div className="space-y-2 text-gray-700 dark:text-gray-300 mb-4 flex-grow">
          {/* --- PERUBAHAN TAMPILAN HARGA --- */}
          <div className="flex items-center">
            <DollarSign size={18} className="mr-2 text-green-600" /> 
            <div>
                <span className="font-semibold text-xl">{formattedPrice}</span>
                {/* Tampilkan durasi menginap */}
                <span className="text-sm text-gray-500"> / {numberOfNights} malam</span>
            </div>
          </div>
          <p className="flex items-center"><Package size={16} className="mr-2 text-blue-600" /> Sisa {room.available_quantity} kamar</p>
          <p className="flex items-start"><BedDouble size={16} className="mr-2 text-purple-600 mt-1" /> {room.facilities}</p>
        </div>
        
        <button onClick={() => onBook(room)} className="btn-primary w-full">
          Pesan Sekarang
        </button>

        <Link 
          to={`/dashboard/rooms/${room.id}`} 
          className="btn-secondary w-full mt-2 flex items-center justify-center"
        >
          <Eye size={16} className="mr-2" />
          Lihat Detail & Ulasan
        </Link>
      </div>
    </div>
  );
}

export default UserRoomCard;
