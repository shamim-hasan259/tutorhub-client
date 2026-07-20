'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X, Star, CheckCircle, RotateCcw } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import api from '@/lib/axios';
import TutorCard from '@/components/tutor/TutorCard';
import { cn } from '@/utils/helpers';
import type { Tutor, Pagination } from '@/types';

const subjects = [
  'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'History', 'Geography', 'Art', 'Music',
  'Economics', 'Psychology', 'Sociology', 'Philosophy', 'Languages',
];

const teachingModes = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'In-Person' },
  { value: 'both', label: 'Both' },
];

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Date Added' },
  { value: 'students', label: 'Most Students' },
];

const priceRanges = [
  { min: 0, max: 25, label: 'Under $25' },
  { min: 25, max: 50, label: '$25 - $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: undefined, label: '$100+' },
];

const ratingOptions = [
  { value: 4.5, label: '4.5 & up' },
  { value: 4.0, label: '4.0 & up' },
  { value: 3.5, label: '3.5 & up' },
  { value: 0, label: 'All ratings' },
];

const experienceOptions = [
  { value: '10', label: '10+ years' },
  { value: '5', label: '5+ years' },
  { value: '3', label: '3+ years' },
  { value: '1', label: '1+ years' },
];

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [teachingMode, setTeachingMode] = useState(searchParams.get('teachingMode') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(Number(searchParams.get('minRating')) || 0);
  const [minExperience, setMinExperience] = useState(searchParams.get('minExperience') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verifiedOnly') === 'true');

  const debouncedSearch = useDebounce(search, 500);

  // Build filter string for URL
  const buildFilterURL = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (subject) params.set('subject', subject);
    if (location) params.set('location', location);
    if (teachingMode) params.set('teachingMode', teachingMode);
    if (sort !== 'rating') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating) params.set('minRating', String(minRating));
    if (minExperience) params.set('minExperience', minExperience);
    if (verifiedOnly) params.set('verifiedOnly', 'true');
    return params.toString();
  }, [search, subject, location, teachingMode, sort, page, minPrice, maxPrice, minRating, minExperience, verifiedOnly]);

  // Fetch tutors
  const fetchTutors = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 12,
        sort,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (subject) params.subject = subject;
      if (location) params.location = location;
      if (teachingMode) params.teachingMode = teachingMode;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await api.get('/tutors', { params });
      setTutors(response.data.data.tutors);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch tutors:', error);
    } finally {
      setLoading(false);
    }
  }, [page, sort, debouncedSearch, subject, location, teachingMode, minPrice, maxPrice]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  // Update URL when filters change
  useEffect(() => {
    const filterStr = buildFilterURL();
    router.push(`/explore${filterStr ? `?${filterStr}` : ''}`, { scroll: false });
  }, [buildFilterURL, router]);

  const clearFilters = () => {
    setSearch('');
    setSubject('');
    setLocation('');
    setTeachingMode('');
    setSort('rating');
    setPage(1);
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setMinExperience('');
    setVerifiedOnly(false);
  };

  const hasActiveFilters = search || subject || location || teachingMode || minPrice || maxPrice || minRating || minExperience || verifiedOnly;

  const activeFilterCount = [subject, location, teachingMode, minPrice, minRating, minExperience, verifiedOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Tutor</h1>
          <p className="text-gray-600 mb-6">Search from hundreds of expert tutors across various subjects</p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, subject, or keyword..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterPanel
              subject={subject}
              setSubject={setSubject}
              location={location}
              setLocation={setLocation}
              teachingMode={teachingMode}
              setTeachingMode={setTeachingMode}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minRating={minRating}
              setMinRating={setMinRating}
              minExperience={minExperience}
              setMinExperience={setMinExperience}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              setPage={setPage}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Filter Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {subject && (
                  <FilterTag label={subject} onRemove={() => setSubject('')} />
                )}
                {location && (
                  <FilterTag label={location} onRemove={() => setLocation('')} />
                )}
                {teachingMode && (
                  <FilterTag label={teachingMode} onRemove={() => setTeachingMode('')} />
                )}
                {(minPrice || maxPrice) && (
                  <FilterTag
                    label={`${minPrice ? `$${minPrice}` : '$0'} - ${maxPrice ? `$${maxPrice}` : '∞'}`}
                    onRemove={() => { setMinPrice(''); setMaxPrice(''); }}
                  />
                )}
                {minRating > 0 && (
                  <FilterTag label={`${minRating}+ stars`} onRemove={() => setMinRating(0)} />
                )}
                {minExperience && (
                  <FilterTag label={`${minExperience}+ years exp`} onRemove={() => setMinExperience('')} />
                )}
                {verifiedOnly && (
                  <FilterTag label="Verified only" onRemove={() => setVerifiedOnly(false)} />
                )}
              </div>
            )}

            {/* Results */}
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : tutors.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">No tutors found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tutors.map((tutor) => (
                    <TutorCard key={tutor._id} tutor={tutor} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
                      const pageNum = Math.max(1, Math.min(page - 2, pagination.pages - 4)) + i;
                      if (pageNum > pagination.pages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={cn(
                            'w-10 h-10 text-sm font-medium rounded-lg transition-colors',
                            page === pageNum
                              ? 'bg-primary text-white'
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}

                <p className="text-center text-sm text-gray-500 mt-4">
                  Showing {((page - 1) * 12) + 1} - {Math.min(page * 12, pagination.total)} of {pagination.total} tutors
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel
                subject={subject}
                setSubject={setSubject}
                location={location}
                setLocation={setLocation}
                teachingMode={teachingMode}
                setTeachingMode={setTeachingMode}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                minRating={minRating}
                setMinRating={setMinRating}
                minExperience={minExperience}
                setMinExperience={setMinExperience}
                verifiedOnly={verifiedOnly}
                setVerifiedOnly={setVerifiedOnly}
                setPage={setPage}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Filter Panel Component
function FilterPanel({
  subject, setSubject,
  location, setLocation,
  teachingMode, setTeachingMode,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  minRating, setMinRating,
  minExperience, setMinExperience,
  verifiedOnly, setVerifiedOnly,
  setPage,
}: {
  subject: string; setSubject: (v: string) => void;
  location: string; setLocation: (v: string) => void;
  teachingMode: string; setTeachingMode: (v: string) => void;
  minPrice: string; setMinPrice: (v: string) => void;
  maxPrice: string; setMaxPrice: (v: string) => void;
  minRating: number; setMinRating: (v: number) => void;
  minExperience: string; setMinExperience: (v: string) => void;
  verifiedOnly: boolean; setVerifiedOnly: (v: boolean) => void;
  setPage: (v: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Verified Only Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          <span className="font-medium text-gray-900">Verified Tutors Only</span>
        </div>
        <button
          onClick={() => { setVerifiedOnly(!verifiedOnly); setPage(1); }}
          className={cn(
            'w-12 h-6 rounded-full transition-colors relative',
            verifiedOnly ? 'bg-primary' : 'bg-gray-300'
          )}
        >
          <span
            className={cn(
              'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
              verifiedOnly ? 'left-7' : 'left-1'
            )}
          />
        </button>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          Minimum Rating
        </h3>
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => { setMinRating(option.value); setPage(1); }}
              className={cn(
                'w-full px-3 py-2 text-left text-sm rounded-lg border transition-colors flex items-center gap-2',
                minRating === option.value
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              )}
            >
              {option.value > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: Math.floor(option.value) }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              )}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Subject</h3>
        <select
          value={subject}
          onChange={(e) => { setSubject(e.target.value); setPage(1); }}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Location</h3>
        <input
          type="text"
          value={location}
          onChange={(e) => { setLocation(e.target.value); setPage(1); }}
          placeholder="Enter city or state..."
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Price Range (per hour)</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setMinPrice(String(range.min));
                setMaxPrice(range.max ? String(range.max) : '');
                setPage(1);
              }}
              className={cn(
                'w-full px-3 py-2 text-left text-sm rounded-lg border transition-colors',
                minPrice === String(range.min) && maxPrice === String(range.max || '')
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Experience</h3>
        <div className="space-y-2">
          {experienceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => { setMinExperience(minExperience === option.value ? '' : option.value); setPage(1); }}
              className={cn(
                'w-full px-3 py-2 text-left text-sm rounded-lg border transition-colors',
                minExperience === option.value
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Teaching Mode Filter */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Teaching Mode</h3>
        <div className="space-y-2">
          {teachingModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => { setTeachingMode(teachingMode === mode.value ? '' : mode.value); setPage(1); }}
              className={cn(
                'w-full px-3 py-2 text-left text-sm rounded-lg border transition-colors',
                teachingMode === mode.value
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Filter Tag Component
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
      {label}
      <button onClick={onRemove} className="hover:bg-primary/20 rounded-full p-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
