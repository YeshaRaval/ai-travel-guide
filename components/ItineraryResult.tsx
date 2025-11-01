'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, DollarSign, Download, Share2, RefreshCw, Save, CheckCircle2, MessageSquare, Edit2, X, Loader2, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Textarea from './ui/Textarea';

interface ItineraryResultProps {
  itinerary: string;
  isGenerating: boolean;
  formData: {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    travelers: string;
    interests: string;
    accommodation: string;
    pace: string;
    additionalNotes: string;
  };
  onNewItinerary: () => void;
  onItineraryUpdate: (newItinerary: string) => void;
  savedItineraryId?: string;
}

export default function ItineraryResult({ itinerary, isGenerating, formData, onNewItinerary, onItineraryUpdate, savedItineraryId }: ItineraryResultProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(!!savedItineraryId);
  const [itineraryId, setItineraryId] = useState(savedItineraryId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(itinerary);
  const [modificationRequest, setModificationRequest] = useState('');
  const [isModifying, setIsModifying] = useState(false);

  // Update edited content when itinerary changes (e.g., from AI modification)
  useEffect(() => {
    setEditedContent(itinerary);
  }, [itinerary]);

  const handleDownload = () => {
    const blob = new Blob([itinerary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.destination}-itinerary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${formData.destination} Travel Itinerary`,
          text: itinerary.substring(0, 200) + '...',
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(itinerary);
      alert('Itinerary copied to clipboard!');
    }
  };

  const handleSave = async (silent = false) => {
    if (!session) {
      router.push('/login');
      return null;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/itineraries/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content: itinerary,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save itinerary');
      }

      setIsSaved(true);
      setItineraryId(data.itineraryId);
      if (!silent) {
        alert('Itinerary saved successfully!');
      }
      return data.itineraryId;
    } catch (error: any) {
      alert(error.message || 'Failed to save itinerary');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChat = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    let chatItineraryId = itineraryId;

    // Auto-save if not saved yet
    if (!isSaved && !isSaving) {
      chatItineraryId = await handleSave(true);
    }

    // Navigate to chat if we have an ID
    if (chatItineraryId) {
      router.push(`/itinerary/${chatItineraryId}/chat`);
    }
  };

  const handleSaveEdit = () => {
    onItineraryUpdate(editedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(itinerary);
    setIsEditing(false);
  };

  const handleModifyItinerary = async () => {
    if (!modificationRequest.trim() || isModifying) return;

    setIsModifying(true);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          additionalNotes: `${formData.additionalNotes}\n\nPrevious Itinerary:\n${itinerary}\n\nModification Request: ${modificationRequest}`,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let newItinerary = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'content') {
                  newItinerary += parsed.content;
                  onItineraryUpdate(newItinerary);
                  setEditedContent(newItinerary);
                }
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        }

        setModificationRequest('');
        setIsSaved(false); // Mark as unsaved since content changed
      }
    } catch (error) {
      console.error('Error modifying itinerary:', error);
      alert('Failed to modify itinerary');
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-8 animate-slide-in-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Personalized Itinerary</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{formData.destination}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formData.startDate} to {formData.endDate}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span className="capitalize">{formData.budget}</span>
              </div>
            </div>
          </div>

          {!isGenerating && itinerary && (
            <div className="flex space-x-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-3 glass rounded-full hover:bg-white/10 transition-all duration-300"
                    title="Edit Itinerary"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleSave()}
                    disabled={isSaving || isSaved}
                    className={`p-3 glass rounded-full transition-all duration-300 ${
                      isSaved
                        ? 'bg-green-500/20 text-green-400'
                        : 'hover:bg-white/10'
                    }`}
                    title={isSaved ? 'Saved' : 'Save Itinerary'}
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleOpenChat}
                    className="p-3 glass rounded-full hover:bg-white/10 transition-all duration-300"
                    title="Chat with AI about this itinerary"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-3 glass rounded-full hover:bg-white/10 transition-all duration-300"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 glass rounded-full hover:bg-white/10 transition-all duration-300"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 glass rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Itinerary Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        {isGenerating && !itinerary ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-6 rounded" style={{ width: `${Math.random() * 30 + 70}%` }}></div>
            ))}
          </div>
        ) : isEditing ? (
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
          <div className="text-gray-300 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => <h1 className="text-3xl font-bold mb-4 gradient-text" {...props} />,
                h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 text-primary" {...props} />,
                h3: ({ ...props }) => <h3 className="text-xl font-bold mt-6 mb-3 text-secondary" {...props} />,
                p: ({ ...props }) => <p className="mb-4" {...props} />,
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
              {itinerary}
            </ReactMarkdown>
            {isGenerating && (
              <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1"></span>
            )}
          </div>
        )}
      </div>

      {/* AI Modification Section */}
      {!isGenerating && itinerary && !isEditing && (
        <div className="mt-8 pt-8 border-t border-border">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold gradient-text">Request AI Modifications</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Ask the AI to make specific changes to your itinerary
            </p>
            <div className="flex space-x-3">
              <input
                type="text"
                value={modificationRequest}
                onChange={(e) => setModificationRequest(e.target.value)}
                placeholder="E.g., Add more budget-friendly options, Include local food spots..."
                disabled={isModifying}
                className="flex-1 px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                style={{ colorScheme: 'dark' }}
                onKeyPress={(e) => e.key === 'Enter' && handleModifyItinerary()}
              />
              <button
                onClick={handleModifyItinerary}
                disabled={isModifying || !modificationRequest.trim()}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                {isModifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Modifying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Modify</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isGenerating && itinerary && (
        <div className="mt-8 pt-8 border-t border-border">
          <Button
            onClick={onNewItinerary}
            variant="glass"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Create Another Itinerary</span>
          </Button>
        </div>
      )}
    </div>
  );
}
