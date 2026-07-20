'use client';

import { useState, useEffect } from 'react';
import { Calendar, Save, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/utils/helpers';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export default function TutorAvailabilityPage() {
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(
    days.map((day) => ({
      day,
      startTime: '09:00',
      endTime: '17:00',
      enabled: day !== 'Sunday',
    }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data: response } = await api.get('/tutors/me');
        const tutor = response.data;
        setTutorId(tutor._id);

        if (tutor.availability && tutor.availability.length > 0) {
          setAvailability(
            days.map((day) => {
              const slot = tutor.availability.find((s: any) => s.day === day);
              return {
                day,
                startTime: slot?.startTime || '09:00',
                endTime: slot?.endTime || '17:00',
                enabled: !!slot,
              };
            })
          );
        }
      } catch (err) {
        setError('Failed to load availability');
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const toggleDay = (index: number) => {
    const newAvailability = [...availability];
    newAvailability[index].enabled = !newAvailability[index].enabled;
    setAvailability(newAvailability);
  };

  const updateTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newAvailability = [...availability];
    newAvailability[index][field] = value;
    setAvailability(newAvailability);
  };

  const handleSave = async () => {
    if (!tutorId) return;
    setSaving(true);
    setError('');
    try {
      const schedule = availability
        .filter((slot) => slot.enabled)
        .map(({ day, startTime, endTime }) => ({ day, startTime, endTime }));
      await api.put(`/tutors/${tutorId}`, { availability: schedule });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
          <p className="text-gray-600">Set your weekly teaching schedule</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
        <p className="text-gray-600">Set your weekly teaching schedule</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          Availability updated successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Weekly Schedule
        </h2>

        <div className="space-y-4">
          {availability.map((slot, index) => (
            <div
              key={slot.day}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border transition-all',
                slot.enabled ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-60'
              )}
            >
              <label className="flex items-center gap-3 min-w-[140px]">
                <input
                  type="checkbox"
                  checked={slot.enabled}
                  onChange={() => toggleDay(index)}
                  className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="font-medium text-gray-900">{slot.day}</span>
              </label>

              {slot.enabled && (
                <div className="flex items-center gap-3 flex-1">
                  <select
                    value={slot.startTime}
                    onChange={(e) => updateTime(index, 'startTime', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <span className="text-gray-500">to</span>
                  <select
                    value={slot.endTime}
                    onChange={(e) => updateTime(index, 'endTime', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-primary/5 rounded-xl">
            <div className="text-2xl font-bold text-primary">
              {availability.filter((s) => s.enabled).length}
            </div>
            <div className="text-sm text-gray-600">Days Available</div>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {availability.filter((s) => s.enabled).reduce((acc, s) => {
                const start = parseInt(s.startTime.split(':')[0]);
                const end = parseInt(s.endTime.split(':')[0]);
                return acc + (end - start);
              }, 0)}h
            </div>
            <div className="text-sm text-gray-600">Total Hours/Week</div>
          </div>
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
