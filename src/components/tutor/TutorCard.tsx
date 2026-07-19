'use client';

import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import BookmarkButton from '@/components/ui/BookmarkButton';
import type { Tutor } from '@/types';

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const user = typeof tutor.userId === 'object' ? tutor.userId : null;

  return (
    <div className="relative group">
      <Link
        href={`/tutor/${tutor._id}`}
        className="block bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-secondary/30 rounded-xl flex items-center justify-center text-3xl overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              '👨‍🏫'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                {user?.name || 'Tutor'}
              </h3>
              {tutor.isVerified && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-primary font-medium">{tutor.title}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{tutor.bio}</p>

        {/* Subjects */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.subjects.slice(0, 3).map((subject) => (
            <span
              key={subject}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {subject}
            </span>
          ))}
          {tutor.subjects.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{tutor.subjects.length - 3} more
            </span>
          )}
        </div>

        {/* Rating and Location */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-gray-900">{tutor.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({tutor.totalReviews})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[100px]">{tutor.location}</span>
          </div>
        </div>

        {/* Price and Mode */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(tutor.hourlyRate)}
            <span className="text-sm font-normal text-gray-500">/hour</span>
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {tutor.teachingMode === 'both' ? 'Online & In-Person' : tutor.teachingMode === 'online' ? 'Online' : 'In-Person'}
          </div>
        </div>
      </Link>

      {/* Bookmark Button - Top Right */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <BookmarkButton tutorId={tutor._id} size="md" />
      </div>
    </div>
  );
}
