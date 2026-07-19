'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import api from '@/lib/axios';
import { formatDate, cn } from '@/utils/helpers';

interface Booking {
  _id: string;
  tutorId: {
    _id: string;
    userId: { name: string; avatar?: string };
    hourlyRate: number;
    location: string;
  };
  date: string;
  time: string;
  subject: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/student');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      fetchBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const filteredBookings = bookings.filter((b) => filter === 'all' || b.status === filter);

  const statusConfig = {
    pending: { color: 'bg-amber-100 text-amber-700', icon: AlertCircle, label: 'Pending' },
    confirmed: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Confirmed' },
    completed: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">Manage your tutoring sessions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-1 text-xs opacity-75">
                ({bookings.filter((b) => b.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
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
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-soft text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' ? "You haven't booked any sessions yet" : `No ${filter} bookings`}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Find a Tutor
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const tutor = booking.tutorId;
            const status = statusConfig[booking.status];
            const StatusIcon = status.icon;

            return (
              <div key={booking._id} className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Tutor Info */}
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
                      <p className="text-sm text-primary">{booking.subject}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(booking.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {booking.time}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    <span className={cn('px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1', status.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Notes: {booking.notes}</p>
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
