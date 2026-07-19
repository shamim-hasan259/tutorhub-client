'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, User, BookOpen, Calendar, Star, LogOut, ClipboardList
} from 'lucide-react';
import { cn } from '@/utils/helpers';

const sidebarLinks = [
  { href: '/tutor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tutor/bookings', label: 'Bookings', icon: ClipboardList },
  { href: '/tutor/reviews', label: 'Reviews', icon: Star },
  { href: '/tutor/profile', label: 'Manage Profile', icon: User },
  { href: '/tutor/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/tutor/availability', label: 'Availability', icon: Calendar },
];

export default function TutorLayout({ children }: { children: React.ReactNode }) {
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
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                    👨‍🏫
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Tutor</p>
                    <p className="text-sm text-gray-500">tutor@email.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-medium">4.9</span>
                  <span className="text-gray-500">• Verified</span>
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
