'use client';

import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import type { Review } from '@/types';

interface ReviewListProps {
  reviews: Review[];
  tutorId: string;
}

export default function ReviewList({ reviews, tutorId }: ReviewListProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Reviews
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500">({reviews.length})</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reviews yet</p>
      ) : (
        <>
          <div className="space-y-6">
            {displayedReviews.map((review) => {
              const student = typeof review.studentId === 'object' ? review.studentId : null;
              return (
                <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center text-lg">
                      {student?.avatar ? (
                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{student?.name || 'Student'}</p>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                      <div className="flex gap-1 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-6 text-primary hover:text-primary/80 font-medium text-sm"
            >
              {showAll ? 'Show less' : `View all ${reviews.length} reviews`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
