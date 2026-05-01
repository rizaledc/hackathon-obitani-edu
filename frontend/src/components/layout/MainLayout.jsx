import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  // Uncomment the below lines if you want to enforce authentication globally for this layout
  // if (!isAuthenticated) {
  //  return <Navigate to="/login" replace />;
  // }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-text-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
