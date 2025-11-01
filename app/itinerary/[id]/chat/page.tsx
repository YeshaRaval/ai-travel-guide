'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Send, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Itinerary {
  _id: string;
  title: string;
  destination: string;
  content: string;
  chatHistory: Message[];
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && id) {
      fetchItinerary();
    }
  }, [status, id, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const fetchItinerary = async () => {
    try {
      const response = await fetch(`/api/itineraries/${id}`);
      const data = await response.json();

      if (response.ok) {
        setItinerary(data);
        setMessages(data.chatHistory || []);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isSending) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsSending(true);
    setStreamingMessage('');

    try {
      const response = await fetch(`/api/itineraries/${id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullResponse = '';
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
                  fullResponse += parsed.content;
                  setStreamingMessage(fullResponse);
                } else if (parsed.type === 'error') {
                  alert(parsed.content);
                }
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        }

        // Add assistant message to chat
        const assistantMessage: Message = {
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
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
    <div className="h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#0a0e27] flex flex-col pt-20 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 glass border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/my-itineraries"
                className="p-2 glass rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold gradient-text">{itinerary.destination}</h1>
                <p className="text-sm text-gray-400">Chat with AI about your trip</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">AI Travel Assistant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <div className="glass rounded-3xl h-full flex flex-col overflow-hidden">
          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-12">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Start a conversation about your trip!</p>
                <p className="text-sm mt-2">Ask questions, request changes, or get recommendations</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'glass'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[70%] glass rounded-2xl p-4">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {streamingMessage}
                    </ReactMarkdown>
                  </div>
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-border p-4 bg-surface/50">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask anything about your trip..."
                disabled={isSending}
                className="flex-1 px-4 py-3 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                style={{ colorScheme: 'dark' }}
              />
              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span>{isSending ? 'Sending...' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
