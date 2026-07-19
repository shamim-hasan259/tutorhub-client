'use client';

import Link from 'next/link';
import { Star, MapPin, ArrowRight } from 'lucide-react';

const featuredTutors = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    subject: 'Mathematics',
    rating: 4.9,
    reviews: 128,
    price: 45,
    location: 'Online',
    avatar: '👩‍🏫',
    bio: 'PhD in Mathematics with 10+ years of teaching experience',
  },
  {
    id: '2',
    name: 'James Chen',
    subject: 'Physics',
    rating: 4.8,
    reviews: 96,
    price: 50,
    location: 'New York',
    avatar: '👨‍🔬',
    bio: 'Former NASA researcher specializing in quantum physics',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    subject: 'English Literature',
    rating: 4.9,
    reviews: 142,
    price: 40,
    location: 'Online',
    avatar: '👩‍🎓',
    bio: 'Published author and creative writing expert',
  },
];

export default function FeaturedTutors() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Tutors
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Hand-picked tutors with exceptional ratings and proven track records
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredTutors.map((tutor) => (
            <Link
              key={tutor.id}
              href={`/tutor/${tutor.id}`}
              className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-secondary/30 rounded-xl flex items-center justify-center text-3xl">
                  {tutor.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {tutor.name}
                  </h3>
                  <p className="text-sm text-primary font-medium">{tutor.subject}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tutor.bio}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-gray-900">{tutor.rating}</span>
                  <span className="text-sm text-gray-500">({tutor.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {tutor.location}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  ${tutor.price}<span className="text-sm font-normal text-gray-500">/hour</span>
                </span>
                <span className="text-sm text-primary font-medium group-hover:underline">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-primary font-semibold"
          >
            View All Tutors
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
