'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin, Trash2 } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency } from '@/utils/helpers';
import type { Bookmark, Tutor } from '@/types';

export default function SavedTutorsPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await api.get('/bookmarks');
        setBookmarks(response.data.data);
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const removeBookmark = async (tutorId: string) => {
    try {
      await api.delete(`/bookmarks/${tutorId}`);
      setBookmarks(bookmarks.filter((b) => {
        const tutor = typeof b.tutorId === 'object' ? b.tutorId : null;
        return tutor?._id !== tutorId;
      }));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Tutors</h1>
        <p className="text-gray-600">Tutors you&apos;ve saved for later</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-soft text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved tutors yet</h3>
          <p className="text-gray-500 mb-6">Start exploring and save tutors you&apos;re interested in</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Explore Tutors
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => {
            const tutor = typeof bookmark.tutorId === 'object' ? bookmark.tutorId as Tutor : null;
            const user = tutor && typeof tutor.userId === 'object' ? tutor.userId : null;

            return (
              <div key={bookmark._id} className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <Link href={`/tutor/${tutor?._id}`} className="flex-shrink-0">
                    <div className="w-16 h-16 bg-secondary/30 rounded-xl flex items-center justify-center text-3xl">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        '👨‍🏫'
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/tutor/${tutor?._id}`} className="font-semibold text-gray-900 hover:text-primary transition-colors">
                          {user?.name || 'Tutor'}
                        </Link>
                        <p className="text-sm text-primary">{tutor?.title}</p>
                      </div>
                      <button
                        onClick={() => removeBookmark(tutor?._id || '')}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">{tutor?.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({tutor?.totalReviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {tutor?.location}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-gray-900">
                        {formatCurrency(tutor?.hourlyRate || 0)}/hr
                      </span>
                      <Link
                        href={`/tutor/${tutor?._id}`}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
