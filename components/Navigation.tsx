'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plane, Compass, Sparkles, User, LogOut, BookOpen } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

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

          {/* Auth Buttons */}
          {status === 'loading' ? (
            <div className="hidden md:block w-24 h-10 glass rounded-full animate-pulse"></div>
          ) : session ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/my-itineraries"
                className="flex items-center space-x-2 px-4 py-2 glass rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <BookOpen className="w-4 h-4" />
                <span>My Trips</span>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full hover:from-primary hover:to-secondary transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>{session.user?.name}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden shadow-lg shadow-primary/20">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-white/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="px-6 py-2.5 glass rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          )}

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
