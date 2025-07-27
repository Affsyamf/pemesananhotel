import React from 'react';
import { Link as ScrollLink } from 'react-scroll';

function Hero() {
  return (
    <div 
      className="h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="bg-black/60 absolute top-0 left-0 w-full h-screen"></div>
      <div className="z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg leading-tight">
          Selamat Datang di Hotel Mewah
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
          Pengalaman menginap tak terlupakan dengan pelayanan terbaik dan fasilitas premium.
        </p>
        <ScrollLink to="rooms" spy={true} smooth={true} offset={-70} duration={500}>
            <button className="mt-8 btn-primary text-lg px-8 py-3 transition-transform hover:scale-105">
                Jelajahi Kamar
            </button>
        </ScrollLink>
      </div>
    </div>
  );
}

export default Hero;