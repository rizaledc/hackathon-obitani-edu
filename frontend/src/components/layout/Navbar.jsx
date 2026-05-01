import React from 'react';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';

const Navbar = () => {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.startsWith('/map')) return 'Eksplorasi Lahan';
    if (path.startsWith('/chat-live')) return 'Obrolan Langsung';
    if (path.startsWith('/chat')) return 'Pakar AI';
    if (path.startsWith('/analytics')) return 'Laporan Analisis';
    if (path.startsWith('/history')) return 'Riwayat Data';
    if (path.startsWith('/admin/users')) return 'Kelola Pengguna';
    if (path.startsWith('/admin/organizations')) return 'Daftar Organisasi';
    if (path.startsWith('/admin/mlops')) return 'Dashboard MLOps';
    return 'Beranda';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-text-primary dark:text-white">
          {getPageTitle(location.pathname)}
        </h1>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-text-secondary rounded-md border border-gray-200 uppercase tracking-wide">
          Orbitani Edu v1.0
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-text-primary dark:text-white">
            {user?.username || 'Pengguna Tamu'}
          </span>
          <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-1 rounded mt-0.5">
            {user?.role || 'user'}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
          {getInitials(user?.username)}
        </div>
        <button
          onClick={toggleTheme}
          className="ml-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
