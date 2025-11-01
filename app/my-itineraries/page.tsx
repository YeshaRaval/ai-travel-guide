'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, DollarSign, Trash2, MessageSquare, Loader2 } from 'lucide-react';

interface Itinerary {
  _id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  createdAt: string;
}

export default function MyItinerariesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchItineraries();
    }
  }, [status, router]);

  const fetchItineraries = async () => {
    try {
      const response = await fetch('/api/itineraries');
      const data = await response.json();

      if (response.ok) {
        setItineraries(data);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItineraries(itineraries.filter((i) => i._id !== id));
      } else {
        alert('Failed to delete itinerary');
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      alert('Failed to delete itinerary');
    } finally {
      setDeletingId(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gradient-to-br dark:from-[#0a0e27] dark:via-[#0f1629] dark:to-[#0a0e27]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gradient-to-br dark:from-[#0a0e27] dark:via-[#0f1629] dark:to-[#0a0e27]">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-slide-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            My <span className="gradient-text">Travel Plans</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your saved itineraries and travel plans
          </p>
        </div>

        {/* Itineraries Grid */}
        {itineraries.length === 0 ? (
          <div className="text-center glass rounded-3xl p-12 animate-slide-in-up">
            <div className="text-gray-600 dark:text-gray-400 mb-6">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No saved itineraries yet</p>
              <p className="text-sm mt-2">Start planning your next adventure!</p>
            </div>
            <Link
              href="/itinerary"
              className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300"
            >
              Create Your First Itinerary
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary, index) => (
              <div
                key={itinerary._id}
                className="glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 gradient-text line-clamp-1">
                    {itinerary.destination}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>
                        {new Date(itinerary.startDate).toLocaleDateString()} -{' '}
                        {new Date(itinerary.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4 text-secondary" />
                      <span className="capitalize">{itinerary.budget}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span>{itinerary.travelers} travelers</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/itinerary/${itinerary._id}`}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary hover:to-secondary rounded-lg font-semibold transition-all duration-300 text-center text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/itinerary/${itinerary._id}/chat`}
                      className="p-2 glass rounded-lg hover:bg-white/10 transition-all duration-300"
                      title="Chat about this trip"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(itinerary._id)}
                      disabled={deletingId === itinerary._id}
                      className="p-2 glass rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === itinerary._id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="px-6 py-3 bg-surface/50 text-xs text-gray-500 border-t border-border">
                  Created {new Date(itinerary.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
