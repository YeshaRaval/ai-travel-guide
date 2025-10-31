'use client';

import { MapPin, Calendar, DollarSign, Download, Share2, RefreshCw } from 'lucide-react';
import Button from './ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ItineraryResultProps {
  itinerary: string;
  isGenerating: boolean;
  formData: {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    travelers: string;
  };
  onNewItinerary: () => void;
}

export default function ItineraryResult({ itinerary, isGenerating, formData, onNewItinerary }: ItineraryResultProps) {
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
