import React from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.startsWith('/map')) return 'Eksplorasi Lahan';
    if (path.startsWith('/chat-live')) return 'Live Chat';
    if (path.startsWith('/chat')) return 'Pakar AI';
    if (path.startsWith('/analytics')) return 'Laporan Analitik';
    if (path.startsWith('/history')) return 'Riwayat Data';
    if (path.startsWith('/admin/users')) return 'Kelola Pengguna';
    if (path.startsWith('/admin/organizations')) return 'Daftar Organisasi';
    if (path.startsWith('/admin/mlops')) return 'Dashboard MLOps';
    return 'Dashboard';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-text-primary">
          {getPageTitle(location.pathname)}
        </h1>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-text-secondary rounded-md border border-gray-200 uppercase tracking-wide">
          Orbitani Edu v1.0
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-text-primary">
            {user?.username || 'Guest User'}
          </span>
          <span className="text-[10px] text-text-secondary uppercase tracking-wider font-bold bg-gray-100 px-2 py-0.5 rounded-full mt-0.5">
            {user?.role || 'User'}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
          {getInitials(user?.username)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
