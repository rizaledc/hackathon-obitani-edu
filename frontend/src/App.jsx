import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import OrbitaniLoader from "./components/OrbitaniLoader";
import MainLayout from "./components/layout/MainLayout";

const LandingPage = lazy(() => import("./features/landing/LandingPage"));
const MapPage = lazy(() => import("./features/map/MapPage"));

function App() {
  return ( 
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><OrbitaniLoader status="processing" /></div>}> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/map" element={<MapPage />} />
          <Route path="/chat" element={<div className="p-6">Chat Page Placeholder</div>} />
          <Route path="/chat-live" element={<div className="p-6">Live Chat Page Placeholder</div>} />
          <Route path="/analytics" element={<div className="p-6">Analytics Page Placeholder</div>} />
          <Route path="/history" element={<div className="p-6">History Page Placeholder</div>} />
          <Route path="/admin/*" element={<div className="p-6">Admin Area Placeholder</div>} />
        </Route>

        <Route path="/login" element={<div className="p-6 flex items-center justify-center h-screen bg-gray-50">Login Page Placeholder</div>} />
      </Routes> 
    </Suspense> 
  );
}

export default App;
