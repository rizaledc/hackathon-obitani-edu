import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { 
  MapTrifold, 
  ChatCircleText, 
  Chats, 
  ChartLineUp, 
  ClockCounterClockwise, 
  Users, 
  Buildings, 
  Cpu, 
  SignOut,
  X
} from '@phosphor-icons/react';
import logo from "../../assets/logo.webp";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, unreadChatCount, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'user';

  const menuItems = [
    { label: 'UTAMA', type: 'header' },
    { path: '/map', icon: <MapTrifold size={20} />, label: 'Eksplorasi Lahan', roles: ['user', 'admin', 'superadmin'] },
    { path: '/chat', icon: <ChatCircleText size={20} />, label: 'Pakar AI', roles: ['user', 'admin', 'superadmin'] },

    { label: 'ANALISIS', type: 'header' },
    { path: '/analytics', icon: <ChartLineUp size={20} />, label: 'Laporan Analisis', roles: ['user', 'admin', 'superadmin'] },
    { path: '/history', icon: <ClockCounterClockwise size={20} />, label: 'Riwayat Data', roles: ['user', 'admin', 'superadmin'] },
  ];

  if (['admin', 'superadmin'].includes(role)) {
    menuItems.push({ label: 'ADMIN', type: 'header' });
    menuItems.push({ path: '/admin/users', icon: <Users size={20} />, label: 'Kelola Pengguna', roles: ['admin', 'superadmin'] });
    if (role === 'superadmin') {
      menuItems.push({ path: '/admin/organizations', icon: <Buildings size={20} />, label: 'Daftar Organisasi', roles: ['superadmin'] });
      menuItems.push({ path: '/admin/mlops', icon: <Cpu size={20} />, label: 'Dashboard MLOps', roles: ['superadmin'] });
    }
  }

  return (
    <div className={`w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-[60] md:z-20 transition-transform duration-300 shadow-xl md:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex items-center justify-between px-6 py-6 border-b md:border-none border-gray-100">
        <div className="flex items-center gap-3 group cursor-pointer">
          <img src={logo} alt="Orbitani Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
          <div>
            <h1 className="text-lg font-bold text-text-primary tracking-tight">
              Orbitani Edu
            </h1>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">
              Precision Agriculture Lab
            </p>
          </div>
        </div>
        <button onClick={() => setIsOpen && setIsOpen(false)} className="md:hidden text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1 rounded-lg">
          <X size={20} weight="bold" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-1 pb-4">
        {menuItems.map((item, index) => {
          if (item.type === 'header') {
            return (
              <div key={index} className="text-xs font-semibold text-text-secondary mt-4 mb-2 px-2">
                {item.label}
              </div>
            );
          }
          
          if (!item.roles.includes(role)) return null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-primary-pale text-primary border-l-[3px] border-primary' 
                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary border-l-[3px] border-transparent'
                }`
              }
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Orbitani Edu v1.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
