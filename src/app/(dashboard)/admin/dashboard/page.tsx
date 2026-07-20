'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, GraduationCap, Calendar, DollarSign,
  Star, AlertCircle, CheckCircle, Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import api from '@/lib/axios';
import { formatRelativeTime } from '@/utils/helpers';

const COLORS = ['#FFB5A8', '#FFC8B8', '#FFE0C8', '#9CA3AF', '#A78BFA'];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    totalStudents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingApprovals: 0,
  });
  const [bookingsByStatus, setBookingsByStatus] = useState<{ name: string; value: number; color: string }[]>([]);
  const [topSubjects, setTopSubjects] = useState<{ subject: string; bookings: number }[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: response } = await api.get('/admin/stats');
      const data = response.data;

      setStats({
        totalUsers: data.totalUsers || 0,
        totalTutors: data.totalTutors || 0,
        totalStudents: data.totalStudents || 0,
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        activeBookings: data.activeBookings || 0,
        pendingApprovals: data.pendingApprovals || 0,
      });

      setBookingsByStatus(data.bookingsByStatus || []);
      setTopSubjects(data.topSubjects || []);
      setRecentBookings(data.recentBookings || []);
      setRecentReviews(data.recentReviews || []);
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Loading dashboard...</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your platform performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTutors}</p>
              <p className="text-xs text-gray-500">Active Tutors</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Bookings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-2xl font-bold text-green-600">{stats.activeBookings}</p>
          <p className="text-xs text-gray-500">Active Bookings</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-2xl font-bold text-amber-600">{stats.pendingApprovals}</p>
          <p className="text-xs text-gray-500">Pending Approvals</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-2xl font-bold text-blue-600">{stats.totalStudents.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Students</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Status */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Status</h3>
          {bookingsByStatus.every((s) => s.value === 0) ? (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
              No booking data yet
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={bookingsByStatus.filter((s) => s.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingsByStatus
                      .filter((s) => s.value > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {bookingsByStatus.map((status) => (
                  <div key={status.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-sm text-gray-600 flex-1">{status.name}</span>
                    <span className="text-sm font-medium">{status.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Subjects */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Subjects</h3>
          {topSubjects.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
              No subject data yet
            </div>
          ) : (
            <div className="space-y-3">
              {topSubjects.map((subject, index) => (
                <div key={subject.subject} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                      <span className="text-sm text-gray-500">{subject.bookings}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(subject.bookings / topSubjects[0].bookings) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/users"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold mb-1">Manage Users</h3>
          <p className="text-white/80 text-sm">View and manage all users</p>
        </Link>
        <Link
          href="/admin/tutors"
          className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold mb-1">Manage Tutors</h3>
          <p className="text-white/80 text-sm">Approve and manage tutors</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-primary hover:text-primary/80 text-sm font-medium">
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
              {recentBookings.slice(0, 5).map((booking: any) => (
                <div key={booking._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
                    📅
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {booking.studentId?.name || 'Student'}
                    </p>
                    <p className="text-xs text-gray-500">
                      with {booking.tutorId?.userId?.name || 'Tutor'} - {booking.subject}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h2>
          {recentReviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReviews.slice(0, 5).map((review: any) => (
                <div key={review._id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {review.studentId?.name || 'Student'} → {review.tutorId?.userId?.name || 'Tutor'}
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
