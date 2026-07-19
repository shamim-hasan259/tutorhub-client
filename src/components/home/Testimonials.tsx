'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Emily Watson',
    role: 'High School Student',
    content: 'EduPro helped me find a math tutor who completely changed my understanding of calculus. I went from struggling to getting an A in just two months!',
    rating: 5,
    avatar: '👩‍🎓',
  },
  {
    id: 2,
    name: 'Michael Park',
    role: 'College Freshman',
    content: 'The AI recommendation was spot-on. My physics tutor explains concepts in a way that finally makes sense. Best investment in my education.',
    rating: 5,
    avatar: '👨‍🎓',
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    role: 'Parent',
    content: 'As a parent, I was worried about finding the right tutor for my daughter. EduPro made it easy, and the results speak for themselves.',
    rating: 5,
    avatar: '👩‍💼',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Students Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of students who have transformed their learning experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-soft relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
