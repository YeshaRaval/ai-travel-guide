'use client';

import { MessageSquare, Sparkles, Map, Plane } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    title: 'Share Your Dreams',
    description: 'Tell us about your ideal destination, travel dates, budget, and interests.',
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Sparkles,
    title: 'AI Magic Happens',
    description: 'Our advanced AI analyzes thousands of options to craft your perfect itinerary.',
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: Map,
    title: 'Get Your Plan',
    description: 'Receive a detailed day-by-day itinerary with activities, dining, and hidden gems.',
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-teal-500/20',
  },
  {
    icon: Plane,
    title: 'Start Exploring',
    description: 'Download your itinerary and embark on an adventure of a lifetime!',
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-red-500/20',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-gradient-to-b dark:from-[#0f1629] dark:to-[#0a0e27]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-slide-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Four simple steps to your perfect vacation. Let AI do the heavy lifting
            while you dream about your next adventure.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Step Card */}
                  <div className="glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 h-full flex flex-col items-center text-center">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-surface border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${step.bgGradient} rounded-3xl flex items-center justify-center mb-6 mt-2`}>
                      <Icon className={`w-10 h-10 ${step.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-8 transform -translate-y-1/2 z-10 items-center justify-center w-16">
                      <div className="w-6 h-6 text-primary dark:text-primary text-primary/60 dark:opacity-50">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
          <a
            href="/itinerary"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300"
          >
            Start Your Journey Now
          </a>
        </div>
      </div>
    </section>
  );
}
