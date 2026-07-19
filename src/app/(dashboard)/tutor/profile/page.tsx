'use client';

import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Save, Plus, Trash2, GraduationCap, Briefcase
} from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/utils/helpers';

export default function TutorProfilePage() {
  const [formData, setFormData] = useState({
    name: 'Tutor User',
    email: 'tutor@email.com',
    phone: '',
    address: '',
    title: 'Mathematics Tutor',
    bio: 'Passionate educator with 5+ years of experience helping students excel in mathematics.',
    hourlyRate: '45',
    teachingMode: 'both',
    location: 'New York',
    education: [
      { degree: 'MSc Mathematics', institution: 'MIT', year: 2020 },
    ],
    experience: [
      { title: 'Math Tutor', institution: 'Khan Academy', startDate: '2020-01-01', description: 'Teaching algebra and calculus' },
    ],
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profile', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      await api.put(`/tutors/1`, {
        title: formData.title,
        bio: formData.bio,
        hourlyRate: Number(formData.hourlyRate),
        teachingMode: formData.teachingMode,
        location: formData.location,
        education: formData.education,
        experience: formData.experience,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', institution: '', year: new Date().getFullYear() }],
    });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const updateEducation = (index: number, field: string, value: string | number) => {
    const newEducation = [...formData.education];
    (newEducation[index] as any)[field] = value;
    setFormData({ ...formData, education: newEducation });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { title: '', institution: '', startDate: '', description: '' }],
    });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...formData.experience];
    (newExperience[index] as any)[field] = value;
    setFormData({ ...formData, experience: newExperience });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Profile</h1>
        <p className="text-gray-600">Update your tutor profile and information</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Mathematics Tutor"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Mode</label>
              <select
                value={formData.teachingMode}
                onChange={(e) => setFormData({ ...formData, teachingMode: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="online">Online Only</option>
                <option value="offline">In-Person Only</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Education
            </h2>
            <button
              type="button"
              onClick={addEducation}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Degree"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="Institution"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="number"
                    value={edu.year}
                    onChange={(e) => updateEducation(index, 'year', Number(e.target.value))}
                    placeholder="Year"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Experience
            </h2>
            <button
              type="button"
              onClick={addExperience}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {formData.experience.map((exp, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl">
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    placeholder="Job Title"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="text"
                    value={exp.institution}
                    onChange={(e) => updateExperience(index, 'institution', e.target.value)}
                    placeholder="Institution"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="text"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Description"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
