// frontend/src/components/admin/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, BedDouble, LogOut } from 'lucide-react';

const SidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-300 transform rounded-md hover:bg-gray-200 ${isActive ? 'bg-gray-200 text-gray-700' : ''
      }`
    }
  >
    {icon}
    <span className="mx-4 font-medium">{children}</span>
  </NavLink>
);

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
        </div>
        <div className="flex flex-col flex-grow p-4">
          <nav>
            <SidebarLink to="/admin/users" icon={<Users className="w-5 h-5" />}>
              Users
            </SidebarLink>
            <SidebarLink to="/admin/rooms" icon={<BedDouble className="w-5 h-5" />}>
              Kamar
            </SidebarLink>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md hover:bg-red-100"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="mx-4 font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        <header className="h-20 flex items-center justify-between px-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Dashboard</h2>
          {/* Bisa ditambahkan info user admin di sini */}
        </header>
        <main className="flex-grow p-6 overflow-auto">
          <Outlet /> {/* Ini akan merender halaman (ManageUsersPage, dll) */}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;