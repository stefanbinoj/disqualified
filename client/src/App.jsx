import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import DefaultPage from "./pages/DefaultPage";
import Navbar from "./components/Navbar1";
import Inbox from "./pages/Inbox";
import Applies from "./pages/Applies";
import Profile from "./pages/Profile";
import PWAPrompt from "./components/PWAPrompt";

function App() {
  return (
    <Router>
      <div className="pb-16"> {/* Padding bottom for navbar space */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/default" element={<DefaultPage />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/applies" element={<Applies />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Navbar />
        <PWAPrompt />
      </div>
    </Router>
  );
}

export default App;
