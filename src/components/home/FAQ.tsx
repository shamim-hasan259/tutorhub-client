'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { cn } from '@/utils/helpers';

const faqs = [
  {
    question: 'How does the AI tutor matching work?',
    answer: 'Our AI analyzes your learning style, subject needs, budget, schedule, and goals to recommend the most suitable tutors. It considers factors like tutor expertise, teaching style, availability, and student reviews to find your perfect match.',
  },
  {
    question: 'How much do tutors cost?',
    answer: 'Tutor rates vary based on experience, subject, and qualifications. Prices typically range from $20 to $80 per hour. You can filter tutors by budget in our explore page to find options that fit your needs.',
  },
  {
    question: 'Can I switch tutors if I\'m not satisfied?',
    answer: 'Absolutely! We want you to be completely satisfied. If your tutor isn\'t the right fit, you can easily browse and connect with another tutor. There\'s no commitment required.',
  },
  {
    question: 'Are the tutoring sessions online or in-person?',
    answer: 'We offer both online and in-person tutoring options. Many of our tutors offer flexible arrangements. You can filter by teaching mode when searching for tutors.',
  },
  {
    question: 'How do I become a tutor on EduPro?',
    answer: 'Simply click "Become a Tutor" and complete your profile. Once verified, you\'ll appear in search results and can start receiving student requests. We verify all tutors to maintain quality.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! New students can book a 30-minute trial session with any tutor at a discounted rate. This lets you experience the teaching style before committing to regular sessions.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, contact our support team.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
