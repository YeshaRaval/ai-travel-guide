'use client';

import { MapPin, Star, Clock } from 'lucide-react';
import Link from 'next/link';

const destinations = [
  {
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'The City of Light awaits with iconic landmarks, world-class cuisine, and timeless romance.',
    rating: 4.9,
    duration: '5-7 days',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
  },
  {
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    description: 'Where ancient traditions meet futuristic innovation in perfect harmony.',
    rating: 4.8,
    duration: '7-10 days',
    highlights: ['Shibuya Crossing', 'Mount Fuji', 'Senso-ji Temple'],
  },
  {
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'Tropical paradise with stunning beaches, ancient temples, and vibrant culture.',
    rating: 4.7,
    duration: '6-8 days',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot', 'Beach Clubs'],
  },
  {
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    description: 'The city that never sleeps offers endless entertainment, culture, and dining.',
    rating: 4.8,
    duration: '4-6 days',
    highlights: ['Times Square', 'Central Park', 'Statue of Liberty'],
  },
  {
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    description: 'Breathtaking sunsets, white-washed buildings, and crystal-clear waters.',
    rating: 4.9,
    duration: '4-5 days',
    highlights: ['Oia Sunset', 'Red Beach', 'Wine Tours'],
  },
  {
    name: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    description: 'Luxury, innovation, and desert adventures in the modern marvel of the Middle East.',
    rating: 4.7,
    duration: '5-7 days',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Palm Jumeirah'],
  },
];

export default function PopularDestinations() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#0a0e27] via-[#0f1629] to-[#0a0e27]">
      {/* Background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Popular <span className="gradient-text">Destinations</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the world&apos;s most amazing places. Let AI help you plan your perfect
            adventure to these incredible destinations.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="group glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 animate-slide-in-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
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
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {destination.name}
                  </h3>
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                </div>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {destination.description}
                </p>

                {/* Duration */}
                <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
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

                {/* CTA */}
                <Link
                  href={`/itinerary?destination=${encodeURIComponent(destination.name)}`}
                  className="w-full py-2.5 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary hover:to-secondary rounded-lg font-semibold transition-all duration-300 block text-center"
                >
                  Plan Your Trip
                </Link>
              </div>
            </div>
          ))}
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
