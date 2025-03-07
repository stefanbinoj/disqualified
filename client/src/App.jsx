import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import DefaultPage from "./pages/DefaultPage";
import Profile from "./pages/Profile";
import PWAPrompt from "./components/PWAPrompt";
import Onboarding from './pages/Onboarding/Onboarding';
import { LanguageProvider } from './contexts/LanguageContext';
import Inbox from "./pages/Inbox";
import Applies from "./pages/Applies";
import Navbar1 from './components/Navbar1';
import Navbar2 from './components/Navbar2';
import AddJob from "./pages/AddJob";

const UserDashboardLayout = () => (
  <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/applies" element={<Applies />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    <Navbar1 />
  </>
);
const EmployerDashboardLayout = () => (
  <>
    <Routes>
      <Route path="/" element={<AddJob />} />
      <Route path="inbox" element={<Inbox />} />
      <Route path="applies" element={<Applies />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
    <Navbar2 />
  </>
);

function App() {
  return (
    <LanguageProvider>
      <Router>
        <PWAPrompt />
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/employer/*" element={<EmployerDashboardLayout />} />
            <Route path="/*" element={<UserDashboardLayout />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
