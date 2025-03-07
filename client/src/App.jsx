import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PWAPrompt from "./components/PWAPrompt";
import Onboarding from "./pages/Onboarding/Onboarding";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar1 from "./components/Navbar1";
import Navbar2 from "./components/Navbar2";
import Inbox1 from "./employer/Inbox";
import Applies1 from "./employer/Applies";
import Profile1 from "./employer/Profile";
import Home from "./employee/Home";
import Inbox2 from "./employee/Inbox";
import Applies2 from "./employee/Applies";
import Profile2 from "./employee/Profile";
import Hire from "./employer/Hire";

const EmployeeDashboardLayout = () => (
  <>
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/inbox" element={<Inbox2 />} />
      <Route path="/applies" element={<Applies2 />} />
      <Route path="/profile" element={<Profile2 />} />
    </Routes>
    <Navbar1 />
  </>
);
const EmployerDashboardLayout = () => (
  <>
    <Routes>
      <Route path="/hire" element={<Hire />} />
      <Route path="/inbox" element={<Inbox1 />} />
      <Route path="/applies" element={<Applies1 />} />
      <Route path="/profile" element={<Profile1 />} />
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
            <Route path="/" element={<Onboarding />} />
            <Route path="/employer/*" element={<EmployerDashboardLayout />} />
            <Route path="/user/*" element={<EmployeeDashboardLayout />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
