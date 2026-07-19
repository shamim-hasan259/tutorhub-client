'use client';

import { useState } from 'react';
import { BookOpen, Plus, X, Save } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/utils/helpers';

const availableSubjects = [
  'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'History', 'Geography', 'Art', 'Music',
  'Economics', 'Psychology', 'Sociology', 'Philosophy', 'Languages',
];

export default function TutorSubjectsPage() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics', 'Physics',
  ]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setSaving(true);
    try {
      await api.put('/tutors/1', { subjects: selectedSubjects });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update subjects:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Subjects</h1>
        <p className="text-gray-600">Select the subjects you can teach</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          Subjects updated successfully!
        </div>
      )}

      {/* Selected Subjects */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Your Subjects ({selectedSubjects.length})
        </h2>
        {selectedSubjects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No subjects selected yet</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {selectedSubjects.map((subject) => (
              <span
                key={subject}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-medium rounded-full"
              >
                {subject}
                <button
                  onClick={() => removeSubject(subject)}
                  className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
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
          {availableSubjects.map((subject) => {
            const isSelected = selectedSubjects.includes(subject);
            return (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                )}
              >
                {isSelected && <span className="mr-1">✓</span>}
                {subject}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Subjects'}
        </button>
      </div>
    </div>
  );
}
