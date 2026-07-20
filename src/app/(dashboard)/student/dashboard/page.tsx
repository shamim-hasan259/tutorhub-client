'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart, Brain, BookOpen, ArrowRight, Star, Calendar,
  TrendingUp, Clock, DollarSign, Award, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import api from '@/lib/axios';

const COLORS = ['#FFB5A8', '#FFC8B8', '#FFE0C8', '#9CA3AF', '#A5B4FC'];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalSpent: 0,
    savedTutors: 0,
    aiRecommendations: 0,
    studyPlans: 0,
    reviewsWritten: 0,
  });
  const [bookingsByMonth, setBookingsByMonth] = useState<{ month: string; bookings: number }[]>([]);
  const [subjectsData, setSubjectsData] = useState<{ name: string; sessions: number; color: string }[]>([]);
  const [spendingByMonth, setSpendingByMonth] = useState<{ month: string; amount: number }[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, paymentsRes, bookmarksRes, reviewsRes, aiRes] = await Promise.all([
        api.get('/bookings/student'),
        api.get('/payments/student').catch(() => ({ data: { data: [] } })),
        api.get('/bookmarks').catch(() => ({ data: { data: [] } })),
        api.get('/reviews/student').catch(() => ({ data: { data: [] } })),
        api.get('/ai/history').catch(() => ({ data: { data: [] } })),
      ]);

      const bookings = bookingsRes.data.data || [];
      const payments = paymentsRes.data.data || [];
      const bookmarks = bookmarksRes.data.data || [];
      const reviews = reviewsRes.data.data || [];
      const aiHistory = aiRes.data.data || [];

      // Stats from bookings
      const totalBookings = bookings.length;
      const completedSessions = bookings.filter((b: any) => b.status === 'completed').length;
      const upcomingSessions = bookings.filter((b: any) =>
        b.status === 'confirmed' || b.status === 'pending'
      ).length;

      // Stats from payments
      const completedPayments = payments.filter((p: any) => p.status === 'completed');
      const totalSpent = Math.round(completedPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0));

      // Stats from other APIs
      const savedTutors = bookmarks.length;
      const reviewsWritten = reviews.length;
      const aiRecommendations = aiHistory.filter((h: any) => h.type === 'tutor_recommendation').length;
      const studyPlans = aiHistory.filter((h: any) => h.type === 'study_plan').length;

      setStats({
        totalBookings,
        completedSessions,
        upcomingSessions,
        totalSpent,
        savedTutors,
        aiRecommendations,
        studyPlans,
        reviewsWritten,
      });

      // Build bookings by month
      const bookingsMap = new Map<string, number>();
      bookings.forEach((b: any) => {
        const date = new Date(b.createdAt || b.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
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
        .map(([name, count], i) => ({ name, sessions: count, color: COLORS[i % COLORS.length] }));
      setSubjectsData(subjectsArr);

      // Build spending by month
      const spendingMap = new Map<string, number>();
      completedPayments.forEach((p: any) => {
        const date = new Date(p.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        spendingMap.set(key, (spendingMap.get(key) || 0) + (p.amount || 0));
      });
      const spendingData = Array.from(spendingMap.entries())
        .map(([key, amount]) => {
          const [year, monthIdx] = key.split('-').map(Number);
          return { month: MONTH_NAMES[monthIdx], amount: Math.round(amount), sortKey: year * 100 + monthIdx };
        })
        .sort((a, b) => a.sortKey - b.sortKey)
        .slice(-6);
      setSpendingByMonth(spendingData.length > 0 ? spendingData : [{ month: 'No data', amount: 0 }]);

      // Upcoming bookings
      const upcoming = bookings
        .filter((b: any) => b.status === 'confirmed' || b.status === 'pending')
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
      setUpcomingBookings(upcoming);
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your learning journey</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              <p className="text-xs text-gray-500">Total Bookings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</p>
              <p className="text-xs text-gray-500">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
              <p className="text-xs text-gray-500">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#FFB5A8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subjects Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions by Subject</h3>
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
                    dataKey="sessions"
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
                    <span className="text-sm font-medium">{subject.sessions}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spending Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={spendingByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => `$${value}`} />
            <Area type="monotone" dataKey="amount" stroke="#FFB5A8" fill="#FFB5A8" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/explore"
          className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Find a Tutor</h3>
          <p className="text-white/80 text-sm mb-4">Browse our expert tutors and find your perfect match</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            Explore Tutors <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
        <Link
          href="/student/ai-recommendations"
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">AI Tutor Match</h3>
          <p className="text-white/80 text-sm mb-4">Let our AI find the best tutors for your specific needs</p>
          <div className="flex items-center gap-2 text-sm font-medium">
            Get Recommendations <Brain className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
            <Link href="/student/bookings" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No upcoming sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center text-lg">
                    👨‍🏫
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {booking.tutorId?.userId?.name || 'Tutor'}
                    </p>
                    <p className="text-xs text-gray-500">{booking.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs font-medium text-primary">{booking.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{stats.completedSessions} sessions completed</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${stats.totalBookings > 0 ? (stats.completedSessions / stats.totalBookings) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {stats.totalBookings > 0 ? Math.round((stats.completedSessions / stats.totalBookings) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{stats.reviewsWritten} reviews written</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${stats.completedSessions > 0 ? Math.min((stats.reviewsWritten / stats.completedSessions) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {stats.completedSessions > 0 ? Math.min(Math.round((stats.reviewsWritten / stats.completedSessions) * 100), 100) : 0}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{stats.studyPlans} study plans created</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${stats.aiRecommendations + stats.studyPlans > 0 ? (stats.studyPlans / (stats.aiRecommendations + stats.studyPlans)) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {stats.aiRecommendations + stats.studyPlans > 0
                  ? Math.round((stats.studyPlans / (stats.aiRecommendations + stats.studyPlans)) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.savedTutors}</p>
              <p className="text-xs text-gray-500">Saved Tutors</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.aiRecommendations}</p>
              <p className="text-xs text-gray-500">AI Recommendations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/30 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.studyPlans}</p>
              <p className="text-xs text-gray-500">Study Plans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
