'use client';

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="nav-container">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand Container */}
          <Link href="/" className="flex items-center group logo-container">
            <div className="relative w-[40px] h-[40px] md:w-[45px] md:h-[45px] transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.jpg"
                alt="Plant Sage Logo"
                fill
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 40px, 45px"
                priority
                aria-label="Plant Sage Home Logo"
              />
            </div>
            <div className="ml-3 flex items-center">
              <span className="text-lg md:text-xl font-bold gradient-text">Plant Sage</span>
              <span className="hidden md:block text-sm text-gray-400 ml-2 pl-2 border-l border-gray-700">Your Green Companion</span>
            </div>
          </Link>

          {/* Navigation Links and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="nav-link"
            >
              Home
            </Link>
            <Link 
              href="#how-it-works" 
              className="nav-link"
            >
              How It Works
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-emerald-400 hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link 
              href="https://www.buymeacoffee.com/mohammedirfan" 
              target="_blank"
              rel="noopener noreferrer"
              className="coffee-button"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-emerald-400 hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-emerald-400 hover:bg-white/10 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
