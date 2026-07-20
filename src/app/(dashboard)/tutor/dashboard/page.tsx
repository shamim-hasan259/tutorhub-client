'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Star, BookOpen, DollarSign,
  Calendar, MessageSquare, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import api from '@/lib/axios';

const COLORS = ['#FFB5A8', '#FFC8B8', '#FFE0C8', '#9CA3AF', '#A5B4FC'];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TutorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageRating: 0,
    totalReviews: 0,
    totalEarnings: 0,
    totalBookings: 0,
    completedSessions: 0,
    pendingBookings: 0,
    activeSubjects: 0,
  });
  const [earningsByMonth, setEarningsByMonth] = useState<{ month: string; earnings: number }[]>([]);
  const [bookingsByMonth, setBookingsByMonth] = useState<{ month: string; bookings: number }[]>([]);
  const [subjectsData, setSubjectsData] = useState<{ name: string; students: number; color: string }[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState<{ rating: string; count: number }[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tutorRes, bookingsRes, reviewsRes, paymentsRes] = await Promise.all([
        api.get('/tutors/me'),
        api.get('/bookings/tutor'),
        api.get('/reviews/tutor/me'),
        api.get('/payments/tutor').catch(() => ({ data: { data: [] } })),
      ]);

      const tutor = tutorRes.data.data;
      const bookings = bookingsRes.data.data || [];
      const reviews = reviewsRes.data.data || [];
      const payments = paymentsRes.data.data || [];

      // Stats from tutor profile
      const totalStudents = tutor.totalStudents || 0;
      const activeSubjects = tutor.subjects?.length || 0;

      // Stats from bookings
      const totalBookings = bookings.length;
      const completedSessions = bookings.filter((b: any) => b.status === 'completed').length;
      const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;

      // Stats from reviews
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
        : 0;

      // Stats from payments
      const completedPayments = payments.filter((p: any) => p.status === 'completed');
      const totalEarnings = completedPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      setStats({
        totalStudents,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        totalEarnings: Math.round(totalEarnings),
        totalBookings,
        completedSessions,
        pendingBookings,
        activeSubjects,
      });

      // Build earnings by month from payments
      const earningsMap = new Map<string, number>();
      completedPayments.forEach((p: any) => {
        const date = new Date(p.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const label = MONTH_NAMES[date.getMonth()];
        earningsMap.set(key, (earningsMap.get(key) || 0) + (p.amount || 0));
      });
      const earningsData = Array.from(earningsMap.entries())
        .map(([key, earnings]) => {
          const [year, monthIdx] = key.split('-').map(Number);
          return { month: MONTH_NAMES[monthIdx], earnings: Math.round(earnings), sortKey: year * 100 + monthIdx };
        })
        .sort((a, b) => a.sortKey - b.sortKey)
        .slice(-6);
      setEarningsByMonth(earningsData.length > 0 ? earningsData : [{ month: 'No data', earnings: 0 }]);

      // Build bookings by month
      const bookingsMap = new Map<string, number>();
      bookings.forEach((b: any) => {
        const date = new Date(b.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const label = MONTH_NAMES[date.getMonth()];
        bookingsMap.set(key, (bookingsMap.get(key) || 0) + 1);
      });
      const bookingsData = Array.from(bookingsMap.entries())
        .map(([key, count]) => {
          const [year, monthIdx] = key.split('-').map(Number);
          return { month: MONTH_NAMES[monthIdx], bookings: count, sortKey: year * 100 + monthIdx };
        })
        .sort((a, b) => a.sortKey - b.sortKey)
        .slice(-6);
      setBookingsByMonth(bookingsData.length > 0 ? bookingsData : [{ month: 'No data', bookings: 0 }]);

      // Build subjects data from bookings
      const subjectMap = new Map<string, number>();
      bookings.forEach((b: any) => {
        if (b.subject) {
          subjectMap.set(b.subject, (subjectMap.get(b.subject) || 0) + 1);
        }
      });
      const subjectsArr = Array.from(subjectMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count], i) => ({ name, students: count, color: COLORS[i % COLORS.length] }));
      setSubjectsData(subjectsArr);

      // Build rating distribution
      const ratingMap = new Map<number, number>();
      for (let i = 1; i <= 5; i++) ratingMap.set(i, 0);
      reviews.forEach((r: any) => {
        const bucket = Math.round(r.rating);
        if (bucket >= 1 && bucket <= 5) {
          ratingMap.set(bucket, (ratingMap.get(bucket) || 0) + 1);
        }
      });
      setRatingDistribution(
        Array.from(ratingMap.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([rating, count]) => ({ rating: `${rating}★`, count }))
      );

      // Recent items
      setRecentBookings(bookings.slice(0, 5));
      setRecentReviews(reviews.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Tutor!</h1>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Tutor!</h1>
        <p className="text-gray-600">Here&apos;s an overview of your teaching activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              <p className="text-xs text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating || '—'}</p>
              <p className="text-xs text-gray-500">Avg Rating</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
              <p className="text-xs text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              <p className="text-xs text-gray-500">Total Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={earningsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${value}`} />
              <Area type="monotone" dataKey="earnings" stroke="#FFB5A8" fill="#FFB5A8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#FFC8B8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Subject */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Subject</h3>
          {subjectsData.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
              No booking data yet
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={subjectsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="students"
                  >
                    {subjectsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {subjectsData.map((subject) => (
                  <div key={subject.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                    <span className="text-sm text-gray-600 flex-1">{subject.name}</span>
                    <span className="text-sm font-medium">{subject.students}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          {stats.totalReviews === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
              No reviews yet
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {ratingDistribution.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-8">{rating}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${(count / stats.totalReviews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">{stats.totalReviews} total reviews</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">{stats.averageRating}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/tutor/profile"
          className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold mb-1">Complete Profile</h3>
          <p className="text-white/80 text-sm">Get more student inquiries</p>
        </Link>
        <Link
          href="/tutor/availability"
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold mb-1">Set Availability</h3>
          <p className="text-white/80 text-sm">Manage your schedule</p>
        </Link>
        <Link
          href="/tutor/bookings"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold mb-1">View Bookings</h3>
          <p className="text-white/80 text-sm">Manage booking requests</p>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link href="/tutor/bookings" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No recent bookings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {booking.studentId?.name || 'Student'}
                    </p>
                    <p className="text-xs text-gray-500">{booking.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
            <Link href="/tutor/reviews" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </Link>
          </div>
          {recentReviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReviews.map((review) => (
                <div key={review._id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {review.studentId?.name || 'Student'}
                    </p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
