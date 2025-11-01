'use client';

import { useState } from 'react';
import { MapPin, Star, Clock, Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import Link from 'next/link';

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  duration: string;
  highlights: string[];
  coordinates: { lat: number; lon: number };
}

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'The City of Light awaits with iconic landmarks, world-class cuisine, and timeless romance.',
    rating: 4.9,
    duration: '5-7 days',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
    coordinates: { lat: 48.8566, lon: 2.3522 },
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    description: 'Where ancient traditions meet futuristic innovation in perfect harmony.',
    rating: 4.8,
    duration: '7-10 days',
    highlights: ['Shibuya Crossing', 'Mount Fuji', 'Senso-ji Temple'],
    coordinates: { lat: 35.6762, lon: 139.6503 },
  },
  {
    id: 3,
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture.',
    rating: 4.7,
    duration: '6-8 days',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot', 'Beach Clubs'],
    coordinates: { lat: -8.3405, lon: 115.0920 },
  },
  {
    id: 4,
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    description: 'The city that never sleeps offers endless entertainment, culture, and dining.',
    rating: 4.8,
    duration: '4-6 days',
    highlights: ['Times Square', 'Central Park', 'Statue of Liberty'],
    coordinates: { lat: 40.7128, lon: -74.0060 },
  },
  {
    id: 5,
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    description: 'Breathtaking sunsets, white-washed buildings, and crystal-clear waters.',
    rating: 4.9,
    duration: '4-5 days',
    highlights: ['Oia Sunset', 'Red Beach', 'Wine Tours'],
    coordinates: { lat: 36.3932, lon: 25.4615 },
  },
  {
    id: 6,
    name: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    description: 'Luxury, innovation, and desert adventures in the modern marvel of the Middle East.',
    rating: 4.7,
    duration: '5-7 days',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Palm Jumeirah'],
    coordinates: { lat: 25.2048, lon: 55.2708 },
  },
];

export default function PopularDestinations() {
  const [weather, setWeather] = useState<Record<number, WeatherData | null>>({});
  const [loadingWeather, setLoadingWeather] = useState<Record<number, boolean>>({});

  const fetchWeather = async (destination: Destination) => {
    setLoadingWeather(prev => ({ ...prev, [destination.id]: true }));
    try {
      const response = await fetch(
        `/api/weather?lat=${destination.coordinates.lat}&lon=${destination.coordinates.lon}`
      );
      const data = await response.json();
      setWeather(prev => ({ ...prev, [destination.id]: data }));
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(prev => ({ ...prev, [destination.id]: null }));
    } finally {
      setLoadingWeather(prev => ({ ...prev, [destination.id]: false }));
    }
  };

  const getWeatherIcon = (description: string) => {
    if (!description) return <Cloud className="w-5 h-5 text-gray-400" />;
    if (description.includes('clear')) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (description.includes('rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (description.includes('cloud')) return <Cloud className="w-5 h-5 text-gray-400" />;
    return <Cloud className="w-5 h-5 text-gray-400" />;
  };
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0a0e27] dark:via-[#0f1629] dark:to-[#0a0e27]">
      {/* Background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Popular <span className="gradient-text">Destinations</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the world&apos;s most amazing places. Let AI help you plan your perfect
            adventure to these incredible destinations.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {destinations.map((destination, index) => {
            const destinationWeather = weather[destination.id];
            const isLoadingWeather = loadingWeather[destination.id];

            return (
            <div
              key={destination.id}
              className="group glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 animate-slide-in-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => {
                if (!destinationWeather && !isLoadingWeather) {
                  fetchWeather(destination);
                }
              }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-surface">
                <div
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url(${destination.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold">{destination.rating}</span>
                </div>

                {/* Weather Widget */}
                {destinationWeather && (
                  <div className="absolute bottom-4 left-4 glass rounded-2xl p-3">
                    <div className="flex items-center space-x-3">
                      {getWeatherIcon(destinationWeather.description)}
                      <div>
                        <p className="text-2xl font-bold">{Math.round(destinationWeather.temp)}°C</p>
                        <p className="text-xs text-gray-400 capitalize">{destinationWeather.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {destination.name}
                  </h3>
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {destination.description}
                </p>

                {/* Duration */}
                <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Best for {destination.duration}</span>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.slice(0, 3).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Weather Details */}
                {destinationWeather && (
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 glass rounded-xl">
                    <div className="text-center">
                      <Thermometer className="w-4 h-4 mx-auto mb-1 text-secondary" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Feels</p>
                      <p className="text-sm font-semibold">{Math.round(destinationWeather.feels_like)}°C</p>
                    </div>
                    <div className="text-center">
                      <Wind className="w-4 h-4 mx-auto mb-1 text-accent" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Wind</p>
                      <p className="text-sm font-semibold">{Math.round(destinationWeather.wind_speed)} m/s</p>
                    </div>
                    <div className="text-center">
                      <Cloud className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Humidity</p>
                      <p className="text-sm font-semibold">{destinationWeather.humidity}%</p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/itinerary?destination=${encodeURIComponent(destination.name)}`}
                  className="w-full py-2.5 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary hover:to-secondary rounded-lg font-semibold transition-all duration-300 block text-center"
                >
                  Plan Your Trip
                </Link>
              </div>
            </div>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="text-center animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/suggestions"
            className="inline-flex items-center space-x-2 px-8 py-4 glass rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
          >
            <span>Explore More Destinations</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
