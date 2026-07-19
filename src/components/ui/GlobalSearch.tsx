'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Star, MapPin, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/utils/helpers';
import type { Tutor } from '@/types';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/tutors', {
          params: { search: debouncedQuery, limit: 5 },
        });
        setResults(response.data.data.tutors);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-500 hover:bg-gray-200 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search tutors...</span>
        <kbd className="hidden lg:inline-flex px-2 py-0.5 bg-white border border-gray-200 rounded text-xs">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              {loading ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, subject, or location..."
                className="flex-1 text-lg outline-none placeholder:text-gray-400"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.length < 2 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>Type at least 2 characters to search</p>
                  <p className="text-sm mt-2 text-gray-400">
                    Search for tutors by name, subject, or location
                  </p>
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No tutors found for &ldquo;{query}&rdquo;</p>
                  <p className="text-sm mt-2 text-gray-400">
                    Try different keywords or browse all tutors
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {results.map((tutor) => {
                    const user = typeof tutor.userId === 'object' ? tutor.userId : null;
                    return (
                      <Link
                        key={tutor._id}
                        href={`/tutor/${tutor._id}`}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            '👨‍🏫'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {user?.name || 'Tutor'}
                          </p>
                          <p className="text-sm text-primary truncate">{tutor.title}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-medium">{tutor.rating.toFixed(1)}</span>
                          </div>
                          <p className="text-sm text-gray-500">${tutor.hourlyRate}/hr</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* View All Link */}
              {results.length > 0 && (
                <div className="px-6 py-3 border-t border-gray-100">
                  <Link
                    href={`/explore?search=${encodeURIComponent(query)}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="block text-center text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    View all results for &ldquo;{query}&rdquo;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
