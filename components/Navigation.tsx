'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plane, Compass, Sparkles } from 'lucide-react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/10 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Plane className="w-8 h-8 text-primary transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-primary blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            <span className="text-2xl font-bold gradient-text">TravelAI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/itinerary"
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan Trip</span>
            </Link>
            <Link
              href="/suggestions"
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <Plane className="w-4 h-4" />
              <span>Discover</span>
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/itinerary"
            className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300"
          >
            Start Planning
          </Link>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-surface-elevated rounded-lg transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
