'use client';

import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: '10 Study Tips to Ace Your Finals',
    excerpt: 'Discover proven strategies that successful students use to prepare for exams effectively.',
    category: 'Study Tips',
    readTime: '5 min read',
    date: 'Dec 15, 2024',
    image: '📚',
  },
  {
    id: 2,
    title: 'How AI is Changing Education',
    excerpt: 'Explore how artificial intelligence is revolutionizing the way we learn and teach.',
    category: 'Education',
    readTime: '7 min read',
    date: 'Dec 12, 2024',
    image: '🤖',
  },
  {
    id: 3,
    title: 'Choosing the Right Tutor for Your Child',
    excerpt: 'A comprehensive guide for parents on finding the perfect tutor match.',
    category: 'Parents',
    readTime: '6 min read',
    date: 'Dec 10, 2024',
    image: '👨‍👩‍👧',
  },
];

export default function LatestArticles() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Articles
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Tips, insights, and guides to help you succeed academically
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-6xl">
                {article.image}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {article.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
