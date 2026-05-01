import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import MapPage from './features/map/MapPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/map" replace />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/chat" element={<div className="p-6">Chat Page</div>} />
        <Route path="/chat-live" element={<div className="p-6">Live Chat Page</div>} />
        <Route path="/analytics" element={<div className="p-6">Analytics Page</div>} />
        <Route path="/history" element={<div className="p-6">History Page</div>} />
        <Route path="/admin/*" element={<div className="p-6">Admin Area</div>} />
      </Route>
      <Route path="/login" element={<div className="p-6 flex items-center justify-center">Login Page Placeholder</div>} />
    </Routes>
  );
}

export default App;
