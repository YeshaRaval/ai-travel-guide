'use client';

import { useState, useEffect } from 'react';
import { MapPin, Star, Calendar, Cloud, Sun, CloudRain, Wind, Thermometer, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  rating: number;
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
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'The City of Light enchants with its timeless elegance, world-class museums, and romantic ambiance. From the Eiffel Tower to charming cafés, every corner tells a story.',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées'],
    bestTimeToVisit: 'April - June, September - October',
    rating: 4.9,
    coordinates: { lat: 48.8566, lon: 2.3522 },
  },
  {
    id: 2,
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    description: 'A mesmerizing blend of ancient traditions and cutting-edge technology. Experience serene temples, bustling markets, and culinary delights that will captivate your senses.',
    highlights: ['Shibuya Crossing', 'Mount Fuji', 'Senso-ji Temple', 'Tokyo Skytree'],
    bestTimeToVisit: 'March - May, September - November',
    rating: 4.8,
    coordinates: { lat: 35.6762, lon: 139.6503 },
  },
  {
    id: 3,
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'A tropical paradise where lush rice terraces meet pristine beaches. Immerse yourself in Balinese culture, yoga retreats, and vibrant sunsets.',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Beach Clubs', 'Sacred Monkey Forest'],
    bestTimeToVisit: 'April - October',
    rating: 4.7,
    coordinates: { lat: -8.3405, lon: 115.0920 },
  },
  {
    id: 4,
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    description: 'The city that never sleeps offers endless possibilities. From Broadway shows to world-class dining and iconic landmarks, NYC is an urban adventure.',
    highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Brooklyn Bridge'],
    bestTimeToVisit: 'April - June, September - November',
    rating: 4.8,
    coordinates: { lat: 40.7128, lon: -74.0060 },
  },
  {
    id: 5,
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    description: 'White-washed buildings perched on dramatic cliffs overlook the azure Aegean Sea. Witness legendary sunsets and explore ancient ruins.',
    highlights: ['Oia Sunset', 'Red Beach', 'Wine Tours', 'Ancient Akrotiri'],
    bestTimeToVisit: 'April - November',
    rating: 4.9,
    coordinates: { lat: 36.3932, lon: 25.4615 },
  },
  {
    id: 6,
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    description: 'A futuristic oasis in the desert, where luxury meets innovation. From record-breaking skyscrapers to traditional souks, Dubai dazzles.',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Palm Jumeirah', 'Dubai Mall'],
    bestTimeToVisit: 'November - March',
    rating: 4.7,
    coordinates: { lat: 25.2048, lon: 55.2708 },
  },
  {
    id: 7,
    name: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    description: 'Gaudí\'s architectural masterpieces meet Mediterranean beaches. Enjoy tapas, flamenco, and a vibrant cultural scene in this Catalonian gem.',
    highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Gothic Quarter'],
    bestTimeToVisit: 'May - June, September - October',
    rating: 4.8,
    coordinates: { lat: 41.3851, lon: 2.1734 },
  },
  {
    id: 8,
    name: 'Maldives',
    country: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    description: 'A collection of pristine islands with crystal-clear waters and overwater bungalows. Perfect for diving, relaxation, and romantic escapes.',
    highlights: ['Overwater Villas', 'Coral Reefs', 'Water Sports', 'Spa Resorts'],
    bestTimeToVisit: 'November - April',
    rating: 4.9,
    coordinates: { lat: 3.2028, lon: 73.2207 },
  },
  {
    id: 9,
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    description: 'Walk through history in the Eternal City. Ancient ruins, Renaissance art, and mouthwatering Italian cuisine await at every turn.',
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
    bestTimeToVisit: 'April - June, September - October',
    rating: 4.8,
    coordinates: { lat: 41.9028, lon: 12.4964 },
  },
];

export default function SuggestionsPage() {
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
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gradient-to-br dark:from-[#0a0e27] dark:via-[#0f1629] dark:to-[#0a0e27]">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Discover Your Next <span className="gradient-text">Adventure</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore curated destinations with live weather updates and AI-powered recommendations.
            Find your perfect getaway today!
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => {
            const destinationWeather = weather[destination.id];
            const isLoadingWeather = loadingWeather[destination.id];

            return (
              <div
                key={destination.id}
                className="group glass rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => {
                  if (!destinationWeather && !isLoadingWeather) {
                    fetchWeather(destination);
                  }
                }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
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
                    <div>
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{destination.country}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                    {destination.description}
                  </p>

                  {/* Best Time */}
                  <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span>{destination.bestTimeToVisit}</span>
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
                    href={`/itinerary?destination=${encodeURIComponent(destination.name + ', ' + destination.country)}`}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary hover:to-secondary rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Plan Your Trip</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
