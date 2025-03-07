import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useState } from "react";
import { Home, Inbox, ClipboardList, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] py-2 z-50">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          isActive 
            ? "flex flex-col items-center text-blue-600 w-1/4 py-2 transition-all duration-300" 
            : "flex flex-col items-center text-gray-500 w-1/4 py-2 transition-all duration-300"
        }
      >
        <Home className="w-6 h-6 mb-1 stroke-current" />
        <span className="text-xs">Home</span>
      </NavLink>
      
      <NavLink 
        to="/applies" 
        className={({ isActive }) => 
          isActive 
            ? "flex flex-col items-center text-blue-600 w-1/4 py-2 transition-all duration-300" 
            : "flex flex-col items-center text-gray-500 w-1/4 py-2 transition-all duration-300"
        }
      >
        <ClipboardList className="w-6 h-6 mb-1 stroke-current" />
        <span className="text-xs">Applies</span>
      </NavLink>
      
      <NavLink 
        to="/inbox" 
        className={({ isActive }) => 
          isActive 
            ? "flex flex-col items-center text-blue-600 w-1/4 py-2 transition-all duration-300" 
            : "flex flex-col items-center text-gray-500 w-1/4 py-2 transition-all duration-300"
        }
      >
        <Inbox className="w-6 h-6 mb-1 stroke-current" />
        <span className="text-xs">Inbox</span>
      </NavLink>
      
      <NavLink 
        to="/profile" 
        className={({ isActive }) => 
          isActive 
            ? "flex flex-col items-center text-blue-600 w-1/4 py-2 transition-all duration-300" 
            : "flex flex-col items-center text-gray-500 w-1/4 py-2 transition-all duration-300"
        }
      >
        <UserCircle className="w-6 h-6 mb-1 stroke-current" />
        <span className="text-xs">Profile</span>
      </NavLink>
    </nav>
  );
};

export default Navbar 