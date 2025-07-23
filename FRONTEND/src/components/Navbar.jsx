// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State untuk menu mobile

  const navLinks = [
    { to: 'about', label: 'Tentang Kami' },
    { to: 'rooms', label: 'Kamar' },
    { to: 'contact', label: 'Kontak' },
  ];

  return (
    <>
      {/* --- NAVBAR DESKTOP --- */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            Hotel Mewah
          </div>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <ScrollLink key={link.to} to={link.to} spy={true} smooth={true} offset={-70} duration={500} className="text-gray-600 hover:text-blue-600 cursor-pointer">
                {link.label}
              </ScrollLink>
            ))}
          </div>
          <RouterLink to="/login" className="hidden md:block">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Login
            </button>
          </RouterLink>

          {/* Tombol Hamburger untuk Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* --- MENU MOBILE (MUNCUL SAAT HAMBURGER DIKLIK) --- */}
      <div className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white z-40 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <ScrollLink key={link.to} to={link.to} spy={true} smooth={true} offset={-70} duration={500} className="text-2xl text-gray-800 cursor-pointer" onClick={() => setIsOpen(false)}>
              {link.label}
            </ScrollLink>
          ))}
          <RouterLink to="/login" onClick={() => setIsOpen(false)}>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg">
              Login
            </button>
          </RouterLink>
        </div>
      </div>
    </>
  );
}

export default Navbar;