'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import api from '@/lib/axios';
import { formatDate, cn } from '@/utils/helpers';

interface Review {
  _id: string;
  tutorId: {
    _id: string;
    userId: { name: string; avatar?: string };
    title: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function StudentReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/student');
      setReviews(response.data.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async (reviewId: string) => {
    try {
      await api.put(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment,
      });
      setEditingId('');
      fetchReviews();
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-gray-600">Reviews you've written for tutors</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-soft text-center">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500 mb-6">Start reviewing tutors after your sessions</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Find a Tutor
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const tutor = review.tutorId;

            return (
              <div key={review._id} className="bg-white rounded-2xl p-6 shadow-soft">
                {editingId === review._id ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center text-xl">
                        {tutor.userId.avatar ? (
                          <img src={tutor.userId.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          '👨‍🏫'
                        )}
                      </div>
                      <div>
                        <Link href={`/tutor/${tutor._id}`} className="font-semibold text-gray-900 hover:text-primary flex items-center gap-1">
                          {tutor.userId.name}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <p className="text-sm text-primary">{tutor.title}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={cn(
                                'w-6 h-6',
                                editRating >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdate(review._id)}
                        className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId('')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center text-xl">
                        {tutor.userId.avatar ? (
                          <img src={tutor.userId.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          '👨‍🏫'
                        )}
                      </div>
                      <div>
                        <Link href={`/tutor/${tutor._id}`} className="font-semibold text-gray-900 hover:text-primary flex items-center gap-1">
                          {tutor.userId.name}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <p className="text-sm text-primary">{tutor.title}</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
