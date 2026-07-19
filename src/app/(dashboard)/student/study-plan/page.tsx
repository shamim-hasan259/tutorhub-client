'use client';

import { useState } from 'react';
import {
  Calendar, Clock, Target, BookOpen, Brain, RefreshCw,
  ChevronDown, ChevronUp, GraduationCap, CheckCircle
} from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/utils/helpers';

interface DailyPlan {
  day: number;
  date: string;
  topics: string[];
  hours: number;
  activities: string[];
  notes: string;
}

interface WeeklyGoal {
  week: number;
  goals: string[];
  milestone: string;
}

interface StudyPlan {
  dailyPlan: DailyPlan[];
  weeklyGoals: WeeklyGoal[];
  revisionPlan: {
    schedule: string[];
    techniques: string[];
  };
  practiceSchedule: {
    weeklyTests: string[];
    finalPractice: string[];
  };
  tips: string[];
}

export default function StudyPlanPage() {
  const [formData, setFormData] = useState({
    subject: '',
    examDate: '',
    dailyStudyTime: '',
    weakChapters: '',
    targetGrade: '',
  });
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/ai/study-plan', {
        ...formData,
        dailyStudyTime: Number(formData.dailyStudyTime),
        weakChapters: formData.weakChapters.split(',').map((c) => c.trim()),
      });
      setStudyPlan(response.data.data.studyPlan);
    } catch (error) {
      console.error('Failed to generate study plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Study Plan Generator</h1>
        <p className="text-gray-600">Create a personalized study plan for your upcoming exam</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Tell us about your exam</h2>
            <p className="text-sm text-gray-500">Our AI will create a personalized study plan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Mathematics, Physics"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Daily Study Time (hours)</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.dailyStudyTime}
                onChange={(e) => setFormData({ ...formData, dailyStudyTime: e.target.value })}
                placeholder="e.g., 3"
                min="0.5"
                max="12"
                step="0.5"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Grade</label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.targetGrade}
                onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                placeholder="e.g., A, 90%, B+"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Weak Chapters (comma separated)</label>
            <input
              type="text"
              value={formData.weakChapters}
              onChange={(e) => setFormData({ ...formData, weakChapters: e.target.value })}
              placeholder="e.g., Chapter 5: Integration, Chapter 8: Probability"
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
                  Generating Plan...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Generate Study Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Study Plan */}
      {studyPlan && (
        <div className="space-y-6">
          {/* Tips */}
          {studyPlan.tips.length > 0 && (
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Study Tips
              </h3>
              <ul className="space-y-2">
                {studyPlan.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Daily Plan */}
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Study Plan</h3>
            <div className="space-y-3">
              {studyPlan.dailyPlan.map((day) => (
                <div key={day.day} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center font-semibold text-primary">
                        {day.day}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Day {day.day}</p>
                        <p className="text-sm text-gray-500">{day.date} • {day.hours} hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
                        {day.topics.slice(0, 2).map((topic, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {topic}
                          </span>
                        ))}
                      </div>
                      {expandedDay === day.day ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {expandedDay === day.day && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Topics</h4>
                          <div className="flex flex-wrap gap-2">
                            {day.topics.map((topic, i) => (
                              <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Activities</h4>
                          <ul className="space-y-1">
                            {day.activities.map((activity, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {day.notes && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                            <p className="text-sm text-gray-600">{day.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goals</h3>
            <div className="space-y-4">
              {studyPlan.weeklyGoals.map((week) => (
                <div key={week.week} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center font-semibold text-secondary text-sm">
                      W{week.week}
                    </div>
                    <h4 className="font-medium text-gray-900">Week {week.week}</h4>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {week.goals.map((goal, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-primary font-medium">Milestone: {week.milestone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revision & Practice */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revision Schedule</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">When to Revise</h4>
                  <ul className="space-y-1">
                    {studyPlan.revisionPlan.schedule.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Techniques</h4>
                  <div className="flex flex-wrap gap-2">
                    {studyPlan.revisionPlan.techniques.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-accent/30 text-amber-700 text-sm rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Schedule</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Weekly Tests</h4>
                  <ul className="space-y-1">
                    {studyPlan.practiceSchedule.weeklyTests.map((test, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Final Practice</h4>
                  <ul className="space-y-1">
                    {studyPlan.practiceSchedule.finalPractice.map((practice, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Regenerate Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Regenerate Plan
          </button>
        </div>
      )}
    </div>
  );
}
