// frontend/src/components/Hero.jsx
import React from 'react';

function Hero() {
  return (
    <div 
      className="h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="bg-black/50 absolute top-0 left-0 w-full h-screen"></div>
      <div className="z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">
          Selamat Datang di Hotel Mewah
        </h1>
        <p className="mt-4 text-lg md:text-xl drop-shadow-md">
          Pengalaman menginap tak terlupakan dengan pelayanan terbaik.
        </p>
      </div>
    </div>
  );
}

export default Hero;