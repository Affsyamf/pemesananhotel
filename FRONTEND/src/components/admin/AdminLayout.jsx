import React, { useState, useEffect } from 'react'; // <-- PERBAIKAN: Tambahkan useEffect
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Hotel, ListChecks, LogOut, Menu, Users, CalendarDays, LayoutDashboard, Tag, BarChart  } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import axios from 'axios'; // <-- PERBAIKAN: Tambahkan import axios

const SidebarLink = ({ to, icon, children, onClick, notificationCount }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center justify-between px-4 py-2 mt-2 text-gray-600 dark:text-gray-300 transition-colors duration-300 transform rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${
        isActive ? 'bg-blue-100 text-blue-700 dark:bg-gray-700' : ''
      }`
    }
  >
    <div className="flex items-center">
      {icon}
      <span className="mx-4 font-medium">{children}</span>
    </div>
    {notificationCount > 0 && (
      <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
        {notificationCount}
      </span>
    )}
  </NavLink>
);

function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newBookingsCount, setNewBookingsCount] = useState(0);

  // --- PERBAIKAN: useEffect yang hilang ---
  // Logika ini penting untuk mengambil data notifikasi dari backend
  useEffect(() => {
    const fetchNewBookingsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/admin/bookings/new-count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNewBookingsCount(response.data.count);
      } catch (error) {
        // Abaikan error agar tidak mengganggu
        console.error("Gagal fetch notifikasi:", error);
      }
    };

    // Panggil sekali saat komponen dimuat
    fetchNewBookingsCount();

    // Set interval untuk memeriksa notifikasi setiap 30 detik
    const intervalId = setInterval(fetchNewBookingsCount, 30000);

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  
  const handleLinkClick = () => {
      setIsSidebarOpen(false);
      // Saat link pesanan diklik, langsung reset notifikasi di frontend
      if (window.location.pathname.includes('/admin/bookings')) {
          setNewBookingsCount(0);
      }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 px-4 py-4 overflow-y-auto transition duration-300 transform bg-white shadow-lg md:relative md:translate-x-0 dark:bg-gray-800 ${
          isSidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}>
        <div className="flex items-center justify-center h-20">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</h1>
        </div>

        <nav className="mt-10">
          {/* PERBAIKAN: Gunakan handleLinkClick untuk semua link */}
          <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} onClick={handleLinkClick}>Dashboard</SidebarLink>
          <SidebarLink to="/admin/users" icon={<Users className="w-5 h-5" />} onClick={handleLinkClick}>Kelola Pengguna</SidebarLink>
          <SidebarLink to="/admin/rooms" icon={<Hotel className="w-5 h-5" />} onClick={handleLinkClick}>Kelola Kamar</SidebarLink>
          <SidebarLink to="/admin/availability" icon={<CalendarDays className="w-5 h-5" />} onClick={handleLinkClick}>Kelola Inventaris</SidebarLink>
          <SidebarLink to="/admin/promos" icon={<Tag className="w-5 h-5" />}>Kelola Promo</SidebarLink>
          <SidebarLink to="/admin/reports" icon={<BarChart className="w-5 h-5" />}>Laporan</SidebarLink>
          <SidebarLink 
            to="/admin/bookings" 
            icon={<ListChecks className="w-5 h-5" />} 
            onClick={handleLinkClick}
            notificationCount={newBookingsCount}
          >
            Kelola Pesanan
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
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Selamat Datang, Admin!</h2>
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
