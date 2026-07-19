'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-soft">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Learning</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find Your Perfect{' '}
              <span className="text-primary">Tutor</span>
              <br />
              with AI Help
            </h1>
            
            <p className="text-lg text-gray-600 max-w-lg">
              EduPro uses artificial intelligence to match you with the best tutors
              based on your learning style, budget, and goals. Start your learning journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-soft-lg hover:shadow-xl"
              >
                Find a Tutor
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-primary/30 hover:text-primary transition-all shadow-soft"
              >
                Become a Tutor
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-500">Expert Tutors</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-500">Happy Students</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">4.9</p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-3xl shadow-soft-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-6xl">🎓</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">Learn Smarter</p>
                  <p className="text-sm text-gray-500">with AI-powered matching</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
