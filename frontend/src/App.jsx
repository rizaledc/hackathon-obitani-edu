import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import OrbitaniLoader from './components/OrbitaniLoader';
import LandingPage from './features/landing/LandingPage';

// Lazy loading MapPage for performance tweak
const MapPage = React.lazy(() => import('./features/map/MapPage'));

const SuspenseFallback = () => (
  <div className="w-full h-full flex items-center justify-center min-h-[50vh]">
    <OrbitaniLoader status="rendering" />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route element={<MainLayout />}>
        <Route 
          path="/map" 
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <MapPage />
            </Suspense>
          } 
        />
        <Route path="/chat" element={<div className="p-6">Chat Page Placeholder</div>} />
        <Route path="/chat-live" element={<div className="p-6">Live Chat Page Placeholder</div>} />
        <Route path="/analytics" element={<div className="p-6">Analytics Page Placeholder</div>} />
        <Route path="/history" element={<div className="p-6">History Page Placeholder</div>} />
        <Route path="/admin/*" element={<div className="p-6">Admin Area Placeholder</div>} />
      </Route>
      
      <Route path="/login" element={<div className="p-6 flex items-center justify-center h-screen bg-gray-50">Login Page Placeholder</div>} />
    </Routes>
  );
}

export default App;
