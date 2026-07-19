'use client';

import Link from 'next/link';
import { Heart, Brain, BookOpen, ArrowRight, Star } from 'lucide-react';

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your learning journey</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-500">Saved Tutors</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">AI Recommendations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/30 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500">Study Plans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/explore"
          className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Find a Tutor</h3>
          <p className="text-white/80 text-sm mb-4">Browse our expert tutors and find your perfect match</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            Explore Tutors <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          href="/student/ai-recommendations"
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">AI Tutor Match</h3>
          <p className="text-white/80 text-sm mb-4">Let our AI find the best tutors for your specific needs</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            Get Recommendations <Brain className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Recent Saved Tutors */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Saved Tutors</h2>
          <Link href="/student/saved-tutors" className="text-primary hover:text-primary/80 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center text-xl">
                👨‍🏫
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Dr. Sarah Mitchell</p>
                <p className="text-sm text-gray-500">Mathematics • $45/hr</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">4.9</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
