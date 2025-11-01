'use client';

import { Brain, Zap, Globe, Shield, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    description: 'Advanced AI analyzes your preferences to create the perfect itinerary tailored just for you.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get your complete travel plan in seconds with real-time AI processing and streaming responses.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Explore destinations worldwide with detailed insights, hidden gems, and local recommendations.',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Reliable & Secure',
    description: 'Your data is safe with enterprise-grade security. Plan your trips with complete peace of mind.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: 'Time Optimized',
    description: 'Smart scheduling ensures you make the most of every moment, with optimal routes and timing.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Heart,
    title: 'Personalized Experience',
    description: 'Every recommendation is crafted based on your interests, budget, and travel style.',
    gradient: 'from-red-500 to-pink-500',
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-gradient-to-b dark:from-[#0a0e27] dark:to-[#0f1629]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background opacity-30"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">TravelAI</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience the future of travel planning with cutting-edge AI technology
            designed to make your journey unforgettable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
