import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-emerald-600">🌿 Plant Sage</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
            >
              How It Works
            </Link>
          </div>

          {/* Buy Me a Coffee button */}
          <div className="flex items-center space-x-4">
            <Link 
              href="https://www.buymeacoffee.com/mohammedirfan" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-emerald-600 text-sm font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 transition-colors duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2"
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Buy me a coffee
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
