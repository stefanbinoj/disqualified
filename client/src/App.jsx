import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import DefaultPage from "./pages/DefaultPage";
import Profile from "./pages/Profile";
import PWAPrompt from "./components/PWAPrompt";
import Onboarding from './pages/Onboarding/Onboarding';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <PWAPrompt />
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/default" element={<DefaultPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
