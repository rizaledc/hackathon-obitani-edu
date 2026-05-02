import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const isMapPage = location.pathname === '/map' || location.pathname === '/';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  // Uncomment the below lines if you want to enforce authentication globally for this layout
  // if (!isAuthenticated) {
  //  return <Navigate to="/login" replace />;
  // }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-text-primary overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-[55] animate-fadeIn" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden w-full">
        <Navbar onMenuClick={() => setIsSidebarOpen(prev => !prev)} />
        <main className={`flex-1 overflow-y-auto relative ${isMapPage ? 'p-0' : 'p-4 md:p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
