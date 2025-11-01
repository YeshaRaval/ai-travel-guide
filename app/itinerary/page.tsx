'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Calendar, DollarSign, Users, Heart, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ChainOfThought from '@/components/ChainOfThought';
import ItineraryResult from '@/components/ItineraryResult';

interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string;
  accommodation: string;
  pace: string;
  additionalNotes: string;
}

const budgetOptions = [
  { value: '', label: 'Select budget range' },
  { value: 'budget', label: 'Budget ($0 - $50/day)' },
  { value: 'moderate', label: 'Moderate ($50 - $150/day)' },
  { value: 'luxury', label: 'Luxury ($150 - $500/day)' },
  { value: 'ultra-luxury', label: 'Ultra Luxury ($500+/day)' },
];

const travelerOptions = [
  { value: '', label: 'Number of travelers' },
  { value: '1', label: 'Solo Traveler' },
  { value: '2', label: '2 People (Couple)' },
  { value: '3-4', label: '3-4 People (Small Group)' },
  { value: '5+', label: '5+ People (Large Group)' },
];

const accommodationOptions = [
  { value: '', label: 'Preferred accommodation' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'resort', label: 'Resort' },
  { value: 'airbnb', label: 'Airbnb/Vacation Rental' },
  { value: 'mixed', label: 'Mixed' },
];

const paceOptions = [
  { value: '', label: 'Travel pace' },
  { value: 'relaxed', label: 'Relaxed (2-3 activities/day)' },
  { value: 'moderate', label: 'Moderate (4-5 activities/day)' },
  { value: 'packed', label: 'Packed (6+ activities/day)' },
];

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '',
    interests: '',
    accommodation: '',
    pace: '',
    additionalNotes: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState('');
  const [chainOfThought, setChainOfThought] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Prefill destination from URL parameter
  useEffect(() => {
    const destinationParam = searchParams.get('destination');
    if (destinationParam) {
      setFormData(prev => ({
        ...prev,
        destination: destinationParam,
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowResult(true);
    setItinerary('');
    setChainOfThought([]);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
                if (parsed.type === 'thought') {
                  setChainOfThought(prev => [...prev, parsed.content]);
                } else if (parsed.type === 'content') {
                  fullResponse += parsed.content;
                  setItinerary(fullResponse);
                }
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceedStep1 = formData.destination && formData.startDate && formData.endDate;
  const canProceedStep2 = formData.budget && formData.travelers && formData.accommodation;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#0a0e27]">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Create Your <span className="gradient-text">Perfect Itinerary</span>
          </h1>
          <p className="text-xl text-gray-400">
            Answer a few questions and let AI craft your dream vacation
          </p>
        </div>

        {!showResult ? (
          <div className="glass rounded-3xl p-8 animate-slide-in-up">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">Step {step} of 3</span>
                <span className="text-sm font-medium text-primary">{Math.round((step / 3) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold flex items-center space-x-2 mb-6">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span>Where & When</span>
                  </h2>

                  <Input
                    label="Destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="e.g., Paris, France"
                    icon={<MapPin className="w-5 h-5" />}
                    required
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Start Date"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      icon={<Calendar className="w-5 h-5" />}
                      required
                    />
                    <Input
                      label="End Date"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      icon={<Calendar className="w-5 h-5" />}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Travel Details */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold flex items-center space-x-2 mb-6">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <span>Travel Details</span>
                  </h2>

                  <Select
                    label="Budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    options={budgetOptions}
                    required
                  />

                  <Select
                    label="Number of Travelers"
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleInputChange}
                    options={travelerOptions}
                    required
                  />

                  <Select
                    label="Accommodation Type"
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleInputChange}
                    options={accommodationOptions}
                    required
                  />

                  <Select
                    label="Travel Pace"
                    name="pace"
                    value={formData.pace}
                    onChange={handleInputChange}
                    options={paceOptions}
                    required
                  />
                </div>
              )}

              {/* Step 3: Preferences */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold flex items-center space-x-2 mb-6">
                    <Heart className="w-6 h-6 text-primary" />
                    <span>Your Interests</span>
                  </h2>

                  <Textarea
                    label="What are your interests?"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    placeholder="e.g., museums, food tours, hiking, nightlife, photography..."
                    rows={4}
                    required
                  />

                  <Textarea
                    label="Additional Notes (Optional)"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any dietary restrictions, mobility concerns, or special requests..."
                    rows={4}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="glass"
                    onClick={handlePrevStep}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                    className="ml-auto flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!formData.interests}
                    className="ml-auto flex items-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Itinerary</span>
                  </Button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Chain of Thought */}
            {chainOfThought.length > 0 && (
              <ChainOfThought thoughts={chainOfThought} isGenerating={isGenerating} />
            )}

            {/* Itinerary Result */}
            <ItineraryResult
              itinerary={itinerary}
              isGenerating={isGenerating}
              formData={formData}
              onNewItinerary={() => {
                setShowResult(false);
                setStep(1);
                setItinerary('');
                setChainOfThought([]);
              }}
              onItineraryUpdate={(newItinerary) => {
                setItinerary(newItinerary);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
