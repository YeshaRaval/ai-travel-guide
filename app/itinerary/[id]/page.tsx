'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Calendar, DollarSign, Loader2, ArrowLeft, Edit2, Save, X, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';

interface Itinerary {
  _id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  content: string;
  createdAt: string;
}

export default function ItineraryDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && id) {
      fetchItinerary();
    }
  }, [status, id, router]);

  const fetchItinerary = async () => {
    try {
      const response = await fetch(`/api/itineraries/${id}`);
      const data = await response.json();

      if (response.ok) {
        setItinerary(data);
        setEditedContent(data.content);
      } else {
        router.push('/my-itineraries');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      router.push('/my-itineraries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        setItinerary(prev => prev ? { ...prev, content: editedContent } : null);
        setIsEditing(false);
        alert('Itinerary updated successfully!');
      } else {
        alert('Failed to update itinerary');
      }
    } catch (error) {
      console.error('Error updating itinerary:', error);
      alert('Failed to update itinerary');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(itinerary?.content || '');
    setIsEditing(false);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#0a0e27]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!itinerary) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#0a0e27]">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <Link
            href="/my-itineraries"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Trips</span>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 gradient-text">{itinerary.destination}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(itinerary.startDate).toLocaleDateString()} -{' '}
                    {new Date(itinerary.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span className="capitalize">{itinerary.budget}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{itinerary.travelers} travelers</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                href={`/itinerary/${id}/chat`}
                className="p-3 glass rounded-full hover:bg-white/10 transition-all duration-300"
                title="Chat with AI"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 glass rounded-full hover:bg-white/10 transition-all duration-300"
                  title="Edit Itinerary"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="p-3 bg-gradient-to-r from-primary to-secondary rounded-full hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50"
                    title="Save Changes"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-3 glass rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                    title="Cancel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="glass rounded-3xl p-8 animate-slide-in-up">
          {isEditing ? (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Edit Your Itinerary
              </label>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={25}
                className="font-mono text-sm"
              />
              <p className="mt-2 text-xs text-gray-400">
                Tip: You can use Markdown formatting for better styling
              </p>
            </div>
          ) : (
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => <h1 className="text-3xl font-bold mb-4 gradient-text" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 text-primary" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-xl font-bold mt-6 mb-3 text-secondary" {...props} />,
                  p: ({ ...props }) => <p className="mb-4 text-gray-300" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                  li: ({ ...props }) => <li className="ml-4" {...props} />,
                  strong: ({ ...props }) => <strong className="text-accent font-semibold" {...props} />,
                  table: ({ ...props }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full glass rounded-xl overflow-hidden" {...props} />
                    </div>
                  ),
                  thead: ({ ...props }) => <thead className="bg-gradient-to-r from-primary/20 to-secondary/20" {...props} />,
                  tbody: ({ ...props }) => <tbody className="divide-y divide-border" {...props} />,
                  tr: ({ ...props }) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
                  th: ({ ...props }) => <th className="px-6 py-4 text-left text-sm font-semibold text-primary border-b border-primary/30" {...props} />,
                  td: ({ ...props }) => <td className="px-6 py-4 text-sm text-gray-300" {...props} />,
                }}
              >
                {itinerary.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
