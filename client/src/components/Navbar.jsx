import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex gap-4">
        <Link to="/" className="text-white hover:text-gray-300">Home</Link>
        <Link to="/about" className="text-white hover:text-gray-300">About</Link>
      </div>
    </nav>
  )
}

export default Navbar 