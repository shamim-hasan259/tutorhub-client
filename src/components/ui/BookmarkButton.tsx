'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/utils/helpers';

interface BookmarkButtonProps {
  tutorId: string;
  initialSaved?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function BookmarkButton({ tutorId, initialSaved = false, size = 'md' }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const response = await api.get(`/bookmarks/check/${tutorId}`);
        setIsSaved(response.data.data.isSaved);
      } catch (error) {
        // Not logged in or error
      }
    };

    checkBookmark();
  }, [tutorId]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      if (isSaved) {
        await api.delete(`/bookmarks/${tutorId}`);
      } else {
        await api.post(`/bookmarks/${tutorId}`);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={cn(
        'rounded-full flex items-center justify-center transition-all',
        sizeClasses[size],
        isSaved
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-transform',
          isSaved && 'fill-current',
          loading && 'animate-pulse'
        )}
      />
    </button>
  );
}
