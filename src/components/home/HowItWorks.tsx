'use client';

import { Search, Brain, GraduationCap } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Tell Us What You Need',
    description: 'Share your subject, learning goals, budget, and schedule. Our AI understands your unique requirements.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Brain,
    title: 'AI Finds Your Match',
    description: 'Our intelligent algorithm analyzes hundreds of tutors and recommends the perfect matches for you.',
    color: 'bg-secondary/20 text-secondary',
  },
  {
    icon: GraduationCap,
    title: 'Start Learning',
    description: 'Connect with your tutor, schedule sessions, and track your progress. Achieve your academic goals.',
    color: 'bg-accent/30 text-amber-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Three simple steps to find your perfect tutor and start learning smarter
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30" />

          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10`}>
                <step.icon className="w-10 h-10" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
