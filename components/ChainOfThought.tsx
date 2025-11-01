'use client';

import { Brain, CheckCircle, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChainOfThoughtProps {
  thoughts: string[];
  isGenerating: boolean;
}

export default function ChainOfThought({ thoughts, isGenerating }: ChainOfThoughtProps) {
  const [visibleThoughts, setVisibleThoughts] = useState<number>(0);

  useEffect(() => {
    if (visibleThoughts < thoughts.length) {
      const timer = setTimeout(() => {
        setVisibleThoughts(visibleThoughts + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visibleThoughts, thoughts.length]);

  return (
    <div className="glass rounded-2xl p-6 animate-slide-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">AI Thinking Process</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Watch how AI plans your perfect trip</p>
        </div>
      </div>

      <div className="space-y-3">
        {thoughts.slice(0, visibleThoughts).map((thought, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">{thought}</p>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center space-x-3 animate-pulse">
            <Loader className="w-5 h-5 text-primary animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing and planning...</p>
          </div>
        )}
      </div>
    </div>
  );
}
