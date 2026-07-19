'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Star, MapPin, Clock, BookOpen, GraduationCap, Briefcase,
  Calendar, MessageSquare, Share2, ChevronLeft
} from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency } from '@/utils/helpers';
import ReviewList from '@/components/tutor/ReviewList';
import RelatedTutors from '@/components/tutor/RelatedTutors';
import BookmarkButton from '@/components/ui/BookmarkButton';
import type { Tutor, Review } from '@/types';

export default function TutorDetailsPage() {
  const params = useParams();
  const tutorId = params.id as string;

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await api.get(`/tutors/${tutorId}`);
        setTutor(response.data.data);

        const reviewsResponse = await api.get(`/reviews/tutor/${tutorId}`);
        setReviews(reviewsResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch tutor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8" />
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="flex gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-64" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Tutor not found</p>
          <Link href="/explore" className="text-primary hover:text-primary/80 font-medium">
            Browse all tutors
          </Link>
        </div>
      </div>
    );
  }

  const user = typeof tutor.userId === 'object' ? tutor.userId : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to tutors
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 bg-secondary/30 rounded-xl flex items-center justify-center text-4xl overflow-hidden flex-shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    '👨‍🏫'
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Tutor'}</h1>
                        {tutor.isVerified && (
                          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-primary font-medium mt-1">{tutor.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookmarkButton tutorId={tutorId} size="md" />
                      <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="font-semibold">{tutor.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({tutor.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-5 h-5" />
                      {tutor.location}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <BookOpen className="w-5 h-5" />
                      {tutor.totalStudents} students taught
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {tutor.subjects.map((subject) => (
                      <span key={subject} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{tutor.bio}</p>
            </div>

            {/* Education */}
            {tutor.education.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h2>
                <div className="space-y-4">
                  {tutor.education.map((edu, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {tutor.experience.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Experience
                </h2>
                <div className="space-y-4">
                  {tutor.experience.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{exp.title}</p>
                        <p className="text-gray-600">{exp.institution}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            {tutor.availability.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Availability
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tutor.availability.map((slot, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-900">{slot.day}</p>
                      <p className="text-sm text-gray-600">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <ReviewList reviews={reviews} tutorId={tutorId} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(tutor.hourlyRate)}
                  </p>
                  <p className="text-gray-500">per hour</p>
                </div>

                <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors mb-3">
                  Book a Session
                </button>
                <button className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Send Message
                </button>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {tutor.teachingMode === 'both' ? 'Online & In-Person' : tutor.teachingMode === 'online' ? 'Online Only' : 'In-Person Only'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{tutor.location}</span>
                  </div>
                </div>
              </div>

              {/* Related Tutors */}
              <RelatedTutors subject={tutor.subjects[0]} currentTutorId={tutorId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
