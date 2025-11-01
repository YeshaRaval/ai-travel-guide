'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Seeded random function to ensure consistent values between server and client
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-[#0a0e27] dark:via-[#0f1629] dark:to-[#0a0e27]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Animated circles - Neon glow effect */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 dark:bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/15 dark:bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Stars background - only render on client to avoid hydration mismatch */}
      {mounted && (
        <div className="absolute inset-0 opacity-20 dark:opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gray-400 dark:bg-white rounded-full"
              style={{
                width: seededRandom(i * 4) * 3 + 1 + 'px',
                height: seededRandom(i * 4 + 1) * 3 + 1 + 'px',
                top: seededRandom(i * 4 + 2) * 100 + '%',
                left: seededRandom(i * 4 + 3) * 100 + '%',
                animation: `pulse-slow ${seededRandom(i * 5) * 3 + 2}s infinite`,
                animationDelay: seededRandom(i * 5 + 1) * 2 + 's',
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left animate-slide-in-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium">AI-Powered Travel Planning</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Dream Trip
              <br />
              <span className="gradient-text">Planned by AI</span>
            </h1>

            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
              Experience personalized travel itineraries crafted by advanced AI.
              From hidden gems to must-see attractions, we&apos;ll plan your perfect journey.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <div className="flex items-center space-x-2 px-4 py-2 glass rounded-full">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">Smart Destinations</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 glass rounded-full">
                <Calendar className="w-4 h-4 text-secondary" />
                <span className="text-sm">Day-by-Day Plans</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 glass rounded-full">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm">Personalized</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/itinerary"
                className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Start Planning Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/suggestions"
                className="px-8 py-4 glass rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Explore Destinations</span>
              </Link>
            </div>
          </div>

          {/* Right Column - Floating Cards */}
          <div className="relative animate-float">
            {/* Floating Cards */}
            <div className="absolute -left-4 top-1/4 glass rounded-2xl p-4 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Paris, France</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">5 days trip</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 glass rounded-2xl p-4 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Bali, Indonesia</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">7 days trip</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
