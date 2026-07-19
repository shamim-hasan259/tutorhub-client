'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Star, MapPin, CheckCircle, XCircle, Eye, ExternalLink } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency, cn } from '@/utils/helpers';

interface Tutor {
  _id: string;
  userId: { name: string; email: string; avatar?: string };
  title: string;
  subjects: string[];
  hourlyRate: number;
  location: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'pending'>('all');

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await api.get('/tutors?limit=100');
      setTutors(response.data.data.tutors);
    } catch (error) {
      console.error('Failed to fetch tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch = tutor.userId.name.toLowerCase().includes(search.toLowerCase()) ||
                         tutor.title.toLowerCase().includes(search.toLowerCase()) ||
                         tutor.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesVerified = verifiedFilter === 'all' ||
                           (verifiedFilter === 'verified' && tutor.isVerified) ||
                           (verifiedFilter === 'pending' && !tutor.isVerified);
    return matchesSearch && matchesVerified;
  });

  const stats = {
    total: tutors.length,
    verified: tutors.filter((t) => t.isVerified).length,
    pending: tutors.filter((t) => !t.isVerified).length,
  };

  const toggleVerification = async (tutorId: string, verified: boolean) => {
    try {
      await api.patch(`/admin/tutors/${tutorId}/verify`, { isVerified: verified });
      setTutors(tutors.map((t) => t._id === tutorId ? { ...t, isVerified: verified } : t));
    } catch (error) {
      console.error('Failed to update verification:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tutor Management</h1>
        <p className="text-gray-600">Manage and verify tutors on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Tutors</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
          <p className="text-sm text-gray-500">Verified</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending Verification</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, title, or subject..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'verified', 'pending'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setVerifiedFilter(filter)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                verifiedFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              )}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tutors Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div key={tutor._id} className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center text-xl">
                    {tutor.userId.avatar ? (
                      <img src={tutor.userId.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      '👨‍🏫'
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{tutor.userId.name}</p>
                    <p className="text-sm text-primary">{tutor.title}</p>
                  </div>
                </div>
                {tutor.isVerified ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    Pending
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {tutor.subjects.slice(0, 3).map((subject) => (
                  <span key={subject} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {subject}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{tutor.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({tutor.totalReviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {tutor.location}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">{formatCurrency(tutor.hourlyRate)}/hr</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleVerification(tutor._id, !tutor.isVerified)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                      tutor.isVerified
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    )}
                  >
                    {tutor.isVerified ? 'Unverify' : 'Verify'}
                  </button>
                  <Link
                    href={`/tutor/${tutor._id}`}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTutors.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
          <p className="text-gray-500">No tutors found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
