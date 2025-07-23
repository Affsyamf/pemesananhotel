// frontend/src/components/UserNavbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Hotel, ListChecks, LogOut } from 'lucide-react';

function UserNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          Hotel User
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          {/* Link ke halaman pesan kamar */}
          <NavLink to="/dashboard/book" className={navLinkClass}>
            <Hotel size={20} className="mr-2" /> Pesan Kamar
          </NavLink>
          {/* Link ke halaman riwayat pesanan */}
          <NavLink to="/dashboard/my-bookings" className={navLinkClass}>
            <ListChecks size={20} className="mr-2" /> Pesanan Saya
          </NavLink>
        </nav>
        <button onClick={handleLogout} className="btn-secondary flex items-center">
          <LogOut size={18} className="mr-2" /> Logout
        </button>
      </div>
    </header>
  );
}

export default UserNavbar;