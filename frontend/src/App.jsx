import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OrbitaniLoader from "./components/OrbitaniLoader";
import MainLayout from "./components/layout/MainLayout";
import useAuthStore from "./store/authStore";

const LandingPage = lazy(() => import("./features/landing/LandingPage"));
const MapPage = lazy(() => import("./features/map/MapPage"));
const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
          <Route path="/chat" element={<div className="p-6">Chat Page Placeholder</div>} />
          <Route path="/chat-live" element={<div className="p-6">Live Chat Page Placeholder</div>} />
          <Route path="/analytics" element={<div className="p-6">Analytics Page Placeholder</div>} />
          <Route path="/history" element={<div className="p-6">History Page Placeholder</div>} />
          <Route path="/admin/*" element={<div className="p-6">Admin Area Placeholder</div>} />
        </Route>
      </Routes> 
    </Suspense> 
  );
}

export default App;
