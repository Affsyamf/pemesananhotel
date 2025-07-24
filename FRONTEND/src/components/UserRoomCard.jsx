// frontend/src/components/UserRoomCard.jsx
import React from 'react';
import { DollarSign, Package, BedDouble } from 'lucide-react';

function UserRoomCard({ room, onBook }) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(room.price);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <img src={room.image_url || 'https://via.placeholder.com/400x250'} alt={room.name} className="w-full h-56 object-cover" />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold dark:text-white text-gray-900">{room.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{room.type}</p>
        
        <div className="space-y-2 text-gray-700 dark:text-gray-300 mb-4 flex-grow">
          <p className="flex items-center"><DollarSign size={16} className="mr-2 text-green-600" /> <span className="font-semibold">{formattedPrice}</span> / malam</p>
          <p className="flex items-center"><Package size={16} className="mr-2 text-blue-600" /> Sisa {room.quantity} kamar</p>
          <p className="flex items-start"><BedDouble size={16} className="mr-2 text-purple-600 mt-1" /> {room.facilities}</p>
        </div>
        
        <button onClick={() => onBook(room)} className="btn-primary w-full mt-4">
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}

export default UserRoomCard;