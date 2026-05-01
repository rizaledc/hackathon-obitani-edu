import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import OrbitaniLoader from "./components/OrbitaniLoader";
import MainLayout from "./components/layout/MainLayout";
import useAuthStore from "./store/authStore";
import Toast from "./components/ui/Toast";
import ConfirmDialog from "./components/ui/ConfirmDialog";
import useToast from "./hooks/useToast";
import useConfirm from "./hooks/useConfirm";

const LandingPage = lazy(() => import("./features/landing/LandingPage"));
const MapPage = lazy(() => import("./features/map/MapPage"));
const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));
const UserManagement = lazy(() => import("./features/admin/UserManagement"));
const HistoryPage = lazy(() => import("./features/history/HistoryPage"));
const ChatPage = lazy(() => import("./features/chat/ChatPage"));
const AdminMLOps = lazy(() => import("./features/admin/AdminMLOps"));
const AnalyticsPage = lazy(() => import("./features/analytics/AnalyticsPage"));
const AdminOrganizations = lazy(() => import("./features/admin/AdminOrganizations"));

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
  const navigate = useNavigate();
  const { toast, hideToast } = useToast();
  const { confirmState, handleConfirm, handleCancel } = useConfirm();

  useEffect(() => {
    const { fetchMe } = useAuthStore.getState();
    fetchMe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const { checkSession, isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated && !checkSession()) {
        navigate('/login');
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return ( 
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><OrbitaniLoader status="processing" /></div>}> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Dashboard Routes wrapped in MainLayout and ProtectedRoute */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/map" element={<MapPage />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/organizations" element={
            <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
              <AdminOrganizations />
            </ProtectedRoute>
          } />
          <Route path="/admin/mlops" element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AdminMLOps />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes> 
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      {confirmState.visible && (
        <ConfirmDialog 
          message={confirmState.message} 
          onConfirm={handleConfirm} 
          onCancel={handleCancel} 
        />
      )}
    </Suspense> 
  );
}

export default App;
