'use client';

import Link from 'next/link';
import { 
  Calculator, 
  BookOpen, 
  Globe, 
  Atom, 
  Palette, 
  Music, 
  Code, 
  Languages 
} from 'lucide-react';

const subjects = [
  { name: 'Mathematics', icon: Calculator, color: 'bg-blue-50 text-blue-600', tutors: 120 },
  { name: 'English', icon: BookOpen, color: 'bg-green-50 text-green-600', tutors: 95 },
  { name: 'Geography', icon: Globe, color: 'bg-purple-50 text-purple-600', tutors: 45 },
  { name: 'Physics', icon: Atom, color: 'bg-orange-50 text-orange-600', tutors: 68 },
  { name: 'Art', icon: Palette, color: 'bg-pink-50 text-pink-600', tutors: 35 },
  { name: 'Music', icon: Music, color: 'bg-indigo-50 text-indigo-600', tutors: 28 },
  { name: 'Computer Science', icon: Code, color: 'bg-cyan-50 text-cyan-600', tutors: 82 },
  { name: 'Languages', icon: Languages, color: 'bg-amber-50 text-amber-600', tutors: 56 },
];

export default function PopularSubjects() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Subjects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our most in-demand subjects and find expert tutors ready to help you succeed
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.name}
              href={`/explore?subject=${encodeURIComponent(subject.name)}`}
              className="group p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-soft-lg transition-all duration-300"
            >
              <div className={`w-14 h-14 ${subject.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <subject.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
              <p className="text-sm text-gray-500">{subject.tutors} tutors</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
