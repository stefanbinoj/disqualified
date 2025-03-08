import React from "react";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="w-8" /> {/* Spacer for centering */}
        <div className="flex-1 flex justify-center">
          <h1
            className="text-2xl font-bold tracking-wider"
            style={{
              fontFamily: "sans-serif",
              letterSpacing: "0.2em",
              background: "linear-gradient(to right, #000000, #333333)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
            }}
          >
            Rozgar
          </h1>
        </div>
        <Link to="/settings" className="p-2">
          <Settings className="w-6 h-6 text-black" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
