'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, X, Save, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/utils/helpers';

const availableSubjects = [
  'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'History', 'Geography', 'Art', 'Music',
  'Economics', 'Psychology', 'Sociology', 'Philosophy', 'Languages',
];

export default function TutorSubjectsPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data: response } = await api.get('/tutors/me');
        const tutor = response.data;
        setTutorId(tutor._id);
        setSelectedSubjects(tutor.subjects || []);
      } catch (err) {
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const removeSubject = (subject: string) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
  };

  const handleSave = async () => {
    if (!tutorId) return;
    setSaving(true);
    setError('');
    try {
      await api.put(`/tutors/${tutorId}`, { subjects: selectedSubjects });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update subjects');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Subjects</h1>
          <p className="text-gray-600">Select the subjects you can teach</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Subjects</h1>
        <p className="text-gray-600">Select the subjects you can teach</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          Subjects updated successfully!
        </div>
      )}

      {/* Selected Subjects */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Subjects</h2>
        {selectedSubjects.length === 0 ? (
          <p className="text-sm text-gray-500">No subjects selected yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map((subject) => (
              <span
                key={subject}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
              >
                {subject}
                <button
                  onClick={() => removeSubject(subject)}
                  className="hover:text-primary/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Available Subjects */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Subjects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableSubjects.map((subject) => (
            <button
              key={subject}
              onClick={() => toggleSubject(subject)}
              className={cn(
                'p-3 rounded-xl border-2 text-sm font-medium transition-all text-left',
                selectedSubjects.includes(subject)
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              )}
            >
              <div className="flex items-center justify-between">
                {subject}
                {selectedSubjects.includes(subject) && (
                  <BookOpen className="w-4 h-4" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !tutorId}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
