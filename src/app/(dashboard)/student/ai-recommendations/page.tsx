'use client';

import { useState } from 'react';
import { Brain, Sparkles, RefreshCw, ChevronDown, ChevronUp, Star, MapPin } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

interface Recommendation {
  tutor: any;
  matchPercentage: number;
  reason: string;
  strengths: string[];
  concerns: string[];
}

export default function AIRecommendationsPage() {
  const [formData, setFormData] = useState({
    studentClass: '',
    subject: '',
    weakTopics: '',
    budget: '',
    preferredTime: '',
    learningGoal: '',
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [overallAdvice, setOverallAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/ai/recommend-tutor', {
        ...formData,
        weakTopics: formData.weakTopics.split(',').map((t) => t.trim()),
        budget: Number(formData.budget),
      });
      setRecommendations(response.data.data.recommendations);
      setOverallAdvice(response.data.data.overallAdvice);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Tutor Recommendations</h1>
        <p className="text-gray-600">Let our AI find the perfect tutor for your needs</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Tell us about your needs</h2>
            <p className="text-sm text-gray-500">Our AI will analyze and recommend the best tutors</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Class/Grade</label>
            <input
              type="text"
              value={formData.studentClass}
              onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
              placeholder="e.g., 10th Grade, College Freshman"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Mathematics, Physics"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weak Topics (comma separated)</label>
            <input
              type="text"
              value={formData.weakTopics}
              onChange={(e) => setFormData({ ...formData, weakTopics: e.target.value })}
              placeholder="e.g., Calculus, Algebra, Trigonometry"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget (per hour $)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="e.g., 50"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
            <input
              type="text"
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              placeholder="e.g., Weekday evenings, Weekend mornings"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goal</label>
            <input
              type="text"
              value={formData.learningGoal}
              onChange={(e) => setFormData({ ...formData, learningGoal: e.target.value })}
              placeholder="e.g., Pass exam, Improve grades, Learn fundamentals"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get AI Recommendations
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Recommended Tutors</h2>

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-6 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="w-14 h-14 bg-secondary/30 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    👨‍🏫
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {rec.tutor.userId?.name || 'Tutor'}
                      </h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                        {rec.matchPercentage}% Match
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm">{rec.tutor.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-gray-500">{rec.tutor.location}</span>
                      <span className="text-sm font-medium">{formatCurrency(rec.tutor.hourlyRate)}/hr</span>
                    </div>
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedIndex === index && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Why this tutor?</h4>
                        <p className="text-gray-600">{rec.reason}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-green-700 mb-2">Strengths</h4>
                          <ul className="space-y-1">
                            {rec.strengths.map((s, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {rec.concerns.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-amber-700 mb-2">Considerations</h4>
                            <ul className="space-y-1">
                              {rec.concerns.map((c, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {overallAdvice && (
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-semibold text-gray-900 mb-2">Overall Advice</h3>
              <p className="text-gray-600">{overallAdvice}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Regenerate Recommendations
          </button>
        </div>
      )}
    </div>
  );
}
