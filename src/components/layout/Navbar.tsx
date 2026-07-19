'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore Tutors' },
];

const authLinks = [
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Sign Up' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // TODO: Replace with actual auth state
  const isLoggedIn = false;
  const userRole = null;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Edu<span className="text-primary">Pro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-gray-600'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href={userRole === 'tutor' ? '/tutor/dashboard' : '/student/dashboard'}
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {/* TODO: sign out */}}
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  Logout
                </button>
                <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">U</span>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-64' : 'max-h-0'
        )}
      >
        <div className="px-4 py-4 space-y-3 border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-gray-600'
              )}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link
                href={userRole === 'tutor' ? '/tutor/dashboard' : '/student/dashboard'}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {/* TODO: sign out */}}
                className="block text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
