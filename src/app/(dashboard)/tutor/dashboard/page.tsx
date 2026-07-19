'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Star, BookOpen, DollarSign, TrendingUp, ArrowRight,
  Calendar, Clock, Award, MessageSquare
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import api from '@/lib/axios';

const COLORS = ['#FFB5A8', '#FFC8B8', '#FFE0C8', '#9CA3AF'];

export default function TutorDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 24,
    averageRating: 4.9,
    totalReviews: 128,
    totalEarnings: 3450,
    totalBookings: 48,
    completedSessions: 42,
    pendingBookings: 3,
    activeSubjects: 3,
  });

  const [earningsByMonth] = useState([
    { month: 'Sep', earnings: 450 },
    { month: 'Oct', earnings: 680 },
    { month: 'Nov', earnings: 520 },
    { month: 'Dec', earnings: 890 },
    { month: 'Jan', earnings: 1200 },
    { month: 'Feb', earnings: 950 },
  ]);

  const [bookingsByMonth] = useState([
    { month: 'Sep', bookings: 8 },
    { month: 'Oct', bookings: 12 },
    { month: 'Nov', bookings: 10 },
    { month: 'Dec', bookings: 15 },
    { month: 'Jan', bookings: 20 },
    { month: 'Feb', bookings: 16 },
  ]);

  const [subjectsData] = useState([
    { name: 'Mathematics', students: 15, color: '#FFB5A8' },
    { name: 'Physics', students: 8, color: '#FFC8B8' },
    { name: 'Chemistry', students: 5, color: '#FFE0C8' },
  ]);

  const [ratingDistribution] = useState([
    { rating: '5★', count: 85 },
    { rating: '4★', count: 30 },
    { rating: '3★', count: 10 },
    { rating: '2★', count: 2 },
    { rating: '1★', count: 1 },
  ]);

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, reviewsRes] = await Promise.all([
        api.get('/bookings/tutor'),
        api.get('/reviews/tutor/me'),
      ]);

      setRecentBookings(bookingsRes.data.data.slice(0, 3));
      setRecentReviews(reviewsRes.data.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

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
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Students by Subject</h3>
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
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
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

      {/* Performance Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">95%</p>
            <p className="text-sm text-gray-500">Response Rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">89%</p>
            <p className="text-sm text-gray-500">Booking Rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">4.9</p>
            <p className="text-sm text-gray-500">Student Rating</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">87%</p>
            <p className="text-sm text-gray-500">Repeat Students</p>
          </div>
        </div>
      </div>
    </div>
  );
}
