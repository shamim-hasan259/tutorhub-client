'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Heart, Brain, User, LogOut, GraduationCap, ChevronRight, CalendarDays
} from 'lucide-react';
import { cn } from '@/utils/helpers';

const sidebarLinks = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/saved-tutors', label: 'Saved Tutors', icon: Heart },
  { href: '/student/ai-recommendations', label: 'AI Recommendations', icon: Brain },
  { href: '/student/study-plan', label: 'Study Plan', icon: CalendarDays },
  { href: '/student/profile', label: 'Profile', icon: User },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* User Card */}
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center text-xl">
                    🎓
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Student</p>
                    <p className="text-sm text-gray-500">student@email.com</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-white rounded-2xl shadow-soft overflow-hidden">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'bg-primary/5 text-primary border-r-2 border-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                <button className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors border-t border-gray-100">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
