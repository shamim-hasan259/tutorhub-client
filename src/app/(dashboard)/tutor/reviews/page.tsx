'use client';

import { useState, useEffect } from 'react';
import { Star, User, Calendar } from 'lucide-react';
import api from '@/lib/axios';
import { formatDate, cn } from '@/utils/helpers';

interface Review {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function TutorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/tutor/me');
      setReviews(response.data.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((r) => filter === 'all' || r.rating === Number(filter));

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">Reviews from your students</p>
      </div>

      {/* Rating Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="flex flex-col md:flex-row gap-8">
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
            <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
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
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', '5', '4', '3', '2', '1'] as const).map((rating) => (
          <button
            key={rating}
            onClick={() => setFilter(rating)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === rating
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            )}
          >
            {rating === 'all' ? 'All Reviews' : `${rating}★`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-soft text-center">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-500">
            {filter === 'all' ? "You haven't received any reviews yet" : `No ${filter}-star reviews`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                  {review.studentId.avatar ? (
                    <img src={review.studentId.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{review.studentId.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-4 h-4',
                                i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
