'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain, BookOpen, ChevronDown, ChevronUp, Trash2, Loader2,
  Clock, ArrowRight, Star, MapPin, Calendar
} from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency, formatRelativeTime } from '@/utils/helpers';
import { cn } from '@/utils/helpers';
import type { AIHistory } from '@/types';

export default function AIHistoryPage() {
  const [history, setHistory] = useState<AIHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'tutor_recommendation' | 'study_plan'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: response } = await api.get('/ai/history');
      setHistory(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch AI history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(`/ai/history/${id}`);
      setHistory((prev) => prev.filter((h) => h._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      console.error('Failed to delete history entry:', error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredHistory = filter === 'all'
    ? history
    : history.filter((h) => h.type === filter);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI History</h1>
          <p className="text-gray-600">Your past AI tutor recommendations and study plans</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI History</h1>
        <p className="text-gray-600">Your past AI tutor recommendations and study plans</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/student/ai-recommendations"
          className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-5 text-white hover:shadow-lg transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Get New Recommendation</h3>
            <p className="text-white/80 text-sm">Find tutors matched to your needs</p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/80 ml-auto" />
        </Link>
        <Link
          href="/student/study-plan"
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white hover:shadow-lg transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Create Study Plan</h3>
            <p className="text-white/80 text-sm">Generate a personalized study schedule</p>
          </div>
          <ArrowRight className="w-5 h-5 text-white/80 ml-auto" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All', count: history.length },
          { value: 'tutor_recommendation', label: 'Recommendations', count: history.filter((h) => h.type === 'tutor_recommendation').length },
          { value: 'study_plan', label: 'Study Plans', count: history.filter((h) => h.type === 'study_plan').length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as typeof filter)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === tab.value
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-soft text-center">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No AI history yet</p>
          <p className="text-gray-400 text-sm mb-6">
            Start by getting a tutor recommendation or creating a study plan
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/student/ai-recommendations"
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Recommendations
            </Link>
            <Link
              href="/student/study-plan"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Create Study Plan
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((entry) => {
            const isExpanded = expandedId === entry._id;
            const isRecommendation = entry.type === 'tutor_recommendation';
            const input = entry.input as Record<string, any>;
            const output = entry.output as Record<string, any>;

            return (
              <div key={entry._id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => toggleExpand(entry._id)}
                  className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                    isRecommendation ? 'bg-primary/10' : 'bg-secondary/20'
                  )}>
                    {isRecommendation ? (
                      <Brain className="w-6 h-6 text-primary" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {isRecommendation ? 'Tutor Recommendation' : 'Study Plan'}
                      </h3>
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        isRecommendation ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary'
                      )}>
                        {isRecommendation ? input.subject || 'N/A' : input.subject || 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatRelativeTime(entry.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(entry._id);
                      }}
                      disabled={deleting === entry._id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleting === entry._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    {isRecommendation ? (
                      <RecommendationDetails input={input} output={output} />
                    ) : (
                      <StudyPlanDetails input={input} output={output} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecommendationDetails({ input, output }: { input: Record<string, any>; output: Record<string, any> }) {
  const recommendations = output.recommendations || [];
  const overallAdvice = output.overallAdvice || '';

  return (
    <div className="pt-4 space-y-4">
      {/* Input Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {input.studentClass && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Class</p>
            <p className="text-sm font-medium">{input.studentClass}</p>
          </div>
        )}
        {input.subject && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Subject</p>
            <p className="text-sm font-medium">{input.subject}</p>
          </div>
        )}
        {input.budget && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-medium">${input.budget}/hr</p>
          </div>
        )}
        {input.preferredTime && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Preferred Time</p>
            <p className="text-sm font-medium">{input.preferredTime}</p>
          </div>
        )}
        {input.weakTopics?.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
            <p className="text-xs text-gray-500">Weak Topics</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {input.weakTopics.map((topic: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recommended Tutors</h4>
          <div className="space-y-3">
            {recommendations.map((rec: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {rec.tutor?.userId?.name || rec.tutor?.title || 'Tutor'}
                    </p>
                    <p className="text-sm text-primary">{rec.tutor?.title}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {rec.matchPercentage}% match
                  </span>
                </div>
                {rec.reason && (
                  <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                )}
                {rec.strengths?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {rec.strengths.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall Advice */}
      {overallAdvice && (
        <div className="p-4 bg-primary/5 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Overall Advice</h4>
          <p className="text-sm text-gray-600">{overallAdvice}</p>
        </div>
      )}
    </div>
  );
}

function StudyPlanDetails({ input, output }: { input: Record<string, any>; output: Record<string, any> }) {
  const studyPlan = output.studyPlan || output;

  return (
    <div className="pt-4 space-y-4">
      {/* Input Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {input.subject && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Subject</p>
            <p className="text-sm font-medium">{input.subject}</p>
          </div>
        )}
        {input.examDate && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Exam Date</p>
            <p className="text-sm font-medium">
              {new Date(input.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}
        {input.dailyStudyTime && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Daily Study Time</p>
            <p className="text-sm font-medium">{input.dailyStudyTime} hours</p>
          </div>
        )}
        {input.targetGrade && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Target Grade</p>
            <p className="text-sm font-medium">{input.targetGrade}</p>
          </div>
        )}
        {input.weakChapters?.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
            <p className="text-xs text-gray-500">Weak Chapters</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {input.weakChapters.map((ch: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                  {ch}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Daily Plan */}
      {studyPlan.dailyPlan?.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Daily Plan</h4>
          <div className="space-y-2">
            {studyPlan.dailyPlan.slice(0, 7).map((day: any, i: number) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">Day {day.day}</p>
                  <span className="text-xs text-gray-500">{day.hours}h</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {day.topics?.map((topic: string, j: number) => (
                    <span key={j} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {studyPlan.tips?.length > 0 && (
        <div className="p-4 bg-primary/5 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Study Tips</h4>
          <ul className="space-y-1">
            {studyPlan.tips.map((tip: string, i: number) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
