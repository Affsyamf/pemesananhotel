// frontend/src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, BedDouble, ListChecks, LogOut, Menu } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const SidebarLink = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 transform rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 text-gray-700 dark:bg-gray-700' : ''
      }`
    }
  >
    {icon}
    <span className="mx-4 font-medium">{children}</span>
  </NavLink>
);

function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 px-4 py-4 overflow-y-auto transition duration-300 transform bg-white shadow-lg md:relative md:translate-x-0 dark:bg-gray-800 ${isSidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}>
        <div className="flex items-center justify-center h-20">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</h1>
        </div>
        <nav className="mt-10">
           <SidebarLink to="/admin/users" icon={<Users className="w-5 h-5" />} onClick={() => setIsSidebarOpen(false)}>
            Users
          </SidebarLink>
          <SidebarLink to="/admin/rooms" icon={<BedDouble className="w-5 h-5" />} onClick={() => setIsSidebarOpen(false)}>
            Kamar
          </SidebarLink>
          {/* TAMBAHKAN LINK BARU DI SINI */}
          <SidebarLink to="/admin/bookings" icon={<ListChecks className="w-5 h-5" />} onClick={() => setIsSidebarOpen(false)}>
            Riwayat Pesanan
          </SidebarLink>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 mt-5 text-gray-600 dark:text-gray-300 transition-colors duration-300 transform rounded-md hover:bg-red-100 dark:hover:bg-red-900/50"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="mx-4 font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <header className="h-20 flex items-center justify-between px-6 bg-white shadow-md dark:bg-gray-800">
          <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Dashboard</h2>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-grow p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;