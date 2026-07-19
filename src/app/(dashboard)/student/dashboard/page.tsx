'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart, Brain, BookOpen, ArrowRight, Star, Calendar,
  TrendingUp, Clock, DollarSign, Award
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import api from '@/lib/axios';

const COLORS = ['#FFB5A8', '#FFC8B8', '#FFE0C8', '#9CA3AF'];

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 12,
    completedSessions: 8,
    upcomingSessions: 3,
    totalSpent: 360,
    savedTutors: 5,
    aiRecommendations: 3,
    studyPlans: 2,
    reviewsWritten: 6,
  });

  const [bookingsByMonth] = useState([
    { month: 'Sep', bookings: 2 },
    { month: 'Oct', bookings: 4 },
    { month: 'Nov', bookings: 3 },
    { month: 'Dec', bookings: 5 },
    { month: 'Jan', bookings: 8 },
    { month: 'Feb', bookings: 6 },
  ]);

  const [subjectsData] = useState([
    { name: 'Mathematics', sessions: 12, color: '#FFB5A8' },
    { name: 'Physics', sessions: 8, color: '#FFC8B8' },
    { name: 'English', sessions: 5, color: '#FFE0C8' },
    { name: 'Chemistry', sessions: 3, color: '#9CA3AF' },
  ]);

  const [spendingByMonth] = useState([
    { month: 'Sep', amount: 90 },
    { month: 'Oct', amount: 180 },
    { month: 'Nov', amount: 135 },
    { month: 'Dec', amount: 225 },
    { month: 'Jan', amount: 360 },
    { month: 'Feb', amount: 270 },
  ]);

  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    try {
      const response = await api.get('/bookings/student');
      const bookings = response.data.data
        .filter((b: any) => b.status === 'confirmed' || b.status === 'pending')
        .slice(0, 3);
      setUpcomingBookings(bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

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

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">8 sessions completed</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">66%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">6 reviews written</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">50%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">2 study plans created</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">25%</span>
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
