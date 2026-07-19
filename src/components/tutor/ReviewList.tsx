'use client';

import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import ReviewForm from './ReviewForm';
import type { Review } from '@/types';

interface ReviewListProps {
  reviews: Review[];
  tutorId: string;
  onReviewAdded?: () => void;
}

export default function ReviewList({ reviews, tutorId, onReviewAdded }: ReviewListProps) {
  const [showAll, setShowAll] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  const displayedReviews = showAll ? localReviews : localReviews.slice(0, 3);

  const averageRating = localReviews.length > 0
    ? localReviews.reduce((sum, r) => sum + r.rating, 0) / localReviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: localReviews.filter((r) => r.rating === star).length,
    percentage: localReviews.length > 0
      ? (localReviews.filter((r) => r.rating === star).length / localReviews.length) * 100
      : 0,
  }));

  const handleReviewAdded = () => {
    // Refresh reviews
    if (onReviewAdded) {
      onReviewAdded();
    }
  };

  return (
    <div className="space-y-6">
      {/* Review Form */}
      <ReviewForm tutorId={tutorId} onReviewAdded={handleReviewAdded} />

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Reviews ({localReviews.length})
          </h2>
        </div>

        {localReviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <>
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 p-6 bg-gray-50 rounded-xl">
              <div className="text-center md:text-left">
                <p className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                <div className="flex justify-center md:justify-start gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">{localReviews.length} reviews</p>
              </div>

              <div className="flex-1 space-y-2">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-8">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {displayedReviews.map((review) => {
                const student = typeof review.studentId === 'object' ? review.studentId : null;
                return (
                  <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center text-xl">
                        {student?.avatar ? (
                          <img src={student.avatar} alt={student.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{student?.name || 'Student'}</p>
                            <div className="flex gap-1 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                        <p className="text-gray-600 mt-3">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {localReviews.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-6 text-primary hover:text-primary/80 font-medium text-sm"
              >
                {showAll ? 'Show less' : `View all ${localReviews.length} reviews`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
