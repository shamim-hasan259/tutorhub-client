'use client';

import Link from 'next/link';
import { Users, Star, BookOpen, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

export default function TutorDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Tutor!</h1>
        <p className="text-gray-600">Here&apos;s an overview of your teaching activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.9</p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/30 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">Active Subjects</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">$1,250</p>
              <p className="text-sm text-gray-500">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/tutor/profile"
          className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
          <p className="text-white/80 text-sm mb-4">A complete profile gets 3x more student inquiries</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            Edit Profile <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          href="/tutor/availability"
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Set Your Availability</h3>
          <p className="text-white/80 text-sm mb-4">Let students know when you&apos;re available for sessions</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            Manage Schedule <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="font-semibold">4.9</span>
            <span className="text-gray-500">(128 reviews)</span>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Emily Watson', rating: 5, comment: 'Excellent tutor! Very patient and explains concepts clearly.', date: '2 days ago' },
            { name: 'Michael Park', rating: 5, comment: 'Helped me improve my grades significantly. Highly recommend!', date: '1 week ago' },
            { name: 'Sarah Johnson', rating: 4, comment: 'Great teaching style. Looking forward to more sessions.', date: '2 weeks ago' },
          ].map((review, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center text-sm">
                    👤
                  </div>
                  <span className="font-medium text-gray-900">{review.name}</span>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Performance Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">95%</p>
            <p className="text-sm text-gray-500">Response Rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">89%</p>
            <p className="text-sm text-gray-500">Booking Rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">4.9</p>
            <p className="text-sm text-gray-500">Student Rating</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">87%</p>
            <p className="text-sm text-gray-500">Repeat Students</p>
          </div>
        </div>
      </div>
    </div>
  );
}
