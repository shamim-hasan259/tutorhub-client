'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, GraduationCap, Calendar, DollarSign, TrendingUp,
  ArrowRight, Star, AlertCircle, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#FFB5A8', '#FFC8B8', '#FFE0C8', '#9CA3AF', '#A78BFA'];

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 1250,
    totalTutors: 156,
    totalStudents: 1094,
    totalBookings: 3420,
    totalRevenue: 85500,
    activeBookings: 48,
    pendingApprovals: 12,
    monthlyGrowth: 18,
  });

  const [revenueByMonth] = useState([
    { month: 'Sep', revenue: 8500 },
    { month: 'Oct', revenue: 12000 },
    { month: 'Nov', revenue: 10500 },
    { month: 'Dec', revenue: 15000 },
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 21000 },
  ]);

  const [usersByMonth] = useState([
    { month: 'Sep', users: 85 },
    { month: 'Oct', users: 120 },
    { month: 'Nov', users: 95 },
    { month: 'Dec', users: 150 },
    { month: 'Jan', users: 180 },
    { month: 'Feb', users: 210 },
  ]);

  const [bookingsByStatus] = useState([
    { name: 'Completed', value: 2800, color: '#22C55E' },
    { name: 'Confirmed', value: 450, color: '#FFB5A8' },
    { name: 'Pending', value: 120, color: '#FBBF24' },
    { name: 'Cancelled', value: 50, color: '#EF4444' },
  ]);

  const [topSubjects] = useState([
    { subject: 'Mathematics', bookings: 850 },
    { subject: 'Physics', bookings: 620 },
    { subject: 'English', bookings: 540 },
    { subject: 'Chemistry', bookings: 420 },
    { subject: 'Computer Science', bookings: 380 },
  ]);

  const [recentActivity] = useState([
    { id: 1, type: 'booking', message: 'New booking created by John Doe', time: '5 min ago', status: 'pending' },
    { id: 2, type: 'review', message: 'New 5-star review for Dr. Sarah Mitchell', time: '15 min ago', status: 'success' },
    { id: 3, type: 'tutor', message: 'New tutor registration: James Chen', time: '1 hour ago', status: 'info' },
    { id: 4, type: 'payment', message: 'Payment received: $45 from Emily Watson', time: '2 hours ago', status: 'success' },
    { id: 5, type: 'booking', message: 'Booking cancelled by Michael Park', time: '3 hours ago', status: 'warning' },
  ]);

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-2xl font-bold text-primary">+{stats.monthlyGrowth}%</p>
          <p className="text-xs text-gray-500">Monthly Growth</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Users Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Users</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={usersByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="users" fill="#FFB5A8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Status */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Status</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingsByStatus.map((entry, index) => (
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
        </div>

        {/* Top Subjects */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Subjects</h3>
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
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <Link
          href="/admin/analytics"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold mb-1">View Analytics</h3>
          <p className="text-white/80 text-sm">Detailed platform analytics</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activity.status === 'success' ? 'bg-green-100' :
                activity.status === 'pending' ? 'bg-amber-100' :
                activity.status === 'warning' ? 'bg-red-100' :
                'bg-blue-100'
              }`}>
                {activity.status === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                 activity.status === 'pending' ? <AlertCircle className="w-5 h-5 text-amber-600" /> :
                 activity.status === 'warning' ? <AlertCircle className="w-5 h-5 text-red-600" /> :
                 <Star className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
