import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './landing/LandingPage';
import AdminLogin from './dashboard/AdminLogin';
import DashboardLayout from './dashboard/DashboardLayout';

const AppContent: React.FC = () => {
  const { loading, isAuthenticated } = useApp();

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-50">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Pulsing glow */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
          {/* Inner spinner */}
          <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary animate-spin"></div>
          {/* Center core */}
          <div className="absolute text-primary text-xl font-serif">E</div>
        </div>
        <h2 className="mt-8 text-sm tracking-[0.3em] uppercase text-primary/80 font-serif">L’Étoile Dorée</h2>
        <p className="mt-2 text-xs text-zinc-500 tracking-wider">Preparing exquisite experiences...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Admin Login */}
      <Route
        path="/admin/login"
        element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />}
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/admin/login" replace />}
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
