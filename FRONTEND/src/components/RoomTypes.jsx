// frontend/src/components/RoomTypes.jsx
import React from 'react';

const rooms = [
  { 
    name: 'Deluxe Room', 
    desc: 'Kamar elegan dengan pemandangan kota, cocok untuk pebisnis dan pasangan.',
    img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    name: 'Executive Suite', 
    desc: 'Ruang lebih luas dengan area duduk terpisah, memberikan privasi dan kemewahan ekstra.',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    name: 'Presidential Suite', 
    desc: 'Puncak kemewahan dengan fasilitas premium, pelayan pribadi, dan pemandangan terbaik.',
    img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop'
  },
];

function RoomTypes() {
  return (
    <section id="rooms" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Tipe Kamar Kami
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <img src={room.img} alt={room.name} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
                <p className="text-gray-600">{room.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoomTypes;