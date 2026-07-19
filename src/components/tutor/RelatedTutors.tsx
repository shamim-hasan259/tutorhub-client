'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency } from '@/utils/helpers';
import type { Tutor } from '@/types';

interface RelatedTutorsProps {
  subject: string;
  currentTutorId: string;
}

export default function RelatedTutors({ subject, currentTutorId }: RelatedTutorsProps) {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedTutors = async () => {
      try {
        const response = await api.get(`/tutors/subject/${encodeURIComponent(subject)}`);
        const filtered = response.data.data.filter(
          (t: Tutor) => t._id !== currentTutorId
        );
        setTutors(filtered.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch related tutors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedTutors();
  }, [subject, currentTutorId]);

  if (loading || tutors.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft">
      <h3 className="font-semibold text-gray-900 mb-4">Related Tutors</h3>
      <div className="space-y-4">
        {tutors.map((tutor) => {
          const user = typeof tutor.userId === 'object' ? tutor.userId : null;
          return (
            <Link
              key={tutor._id}
              href={`/tutor/${tutor._id}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-secondary/30 rounded-lg flex items-center justify-center text-xl">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  '👨‍🏫'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user?.name || 'Tutor'}</p>
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-gray-600">{tutor.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {formatCurrency(tutor.hourlyRate)}/hr
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
