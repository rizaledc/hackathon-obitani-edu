import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OrbitaniLoader from "./components/OrbitaniLoader";
import MainLayout from "./components/layout/MainLayout";
import useAuthStore from "./store/authStore";

const LandingPage = lazy(() => import("./features/landing/LandingPage"));
const MapPage = lazy(() => import("./features/map/MapPage"));
const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));
const AdminDashboard = lazy(() => import("./features/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./features/admin/UserManagement"));
const HistoryPage = lazy(() => import("./features/history/HistoryPage"));
const ChatPage = lazy(() => import("./features/chat/ChatPage"));
const AdminMLOps = lazy(() => import("./features/admin/AdminMLOps"));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/map" replace />;
  }

  return children;
};

function App() {
  return ( 
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><OrbitaniLoader status="processing" /></div>}> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Dashboard Routes wrapped in MainLayout and ProtectedRoute */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/map" element={<MapPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat-live" element={<div className="p-6">Live Chat Page Placeholder</div>} />
          <Route path="/analytics" element={<div className="p-6">Analytics Page Placeholder</div>} />
          <Route path="/history" element={<HistoryPage />} />
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/organizations" element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <div className="p-6">Daftar Organisasi Placeholder</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/mlops" element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AdminMLOps />
            </ProtectedRoute>
          } />
        </Route>
      </Routes> 
    </Suspense> 
  );
}

export default App;
