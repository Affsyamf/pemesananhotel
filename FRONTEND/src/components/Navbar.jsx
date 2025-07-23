// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link as ScrollLink } from 'react-scroll'; // Untuk smooth scroll
import { Link as RouterLink } from 'react-router-dom'; // Untuk pindah halaman

function Navbar() {
  const navLinks = [
    { to: 'about', label: 'Tentang Kami' },
    { to: 'rooms', label: 'Kamar' },
    { to: 'contact', label: 'Kontak' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">
          Hotel Mewah
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.to}
              to={link.to}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="text-gray-600 hover:text-blue-600 cursor-pointer"
            >
              {link.label}
            </ScrollLink>
          ))}
        </div>
        <RouterLink to="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Login
          </button>
        </RouterLink>
      </div>
    </nav>
  );
}

export default Navbar;