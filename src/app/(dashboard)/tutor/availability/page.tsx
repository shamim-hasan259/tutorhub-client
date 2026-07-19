'use client';

import { useState } from 'react';
import { Calendar, Save } from 'lucide-react';
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
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(
    days.map((day) => ({
      day,
      startTime: '09:00',
      endTime: '17:00',
      enabled: day !== 'Sunday',
    }))
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setSaving(true);
    try {
      const schedule = availability
        .filter((slot) => slot.enabled)
        .map(({ day, startTime, endTime }) => ({ day, startTime, endTime }));
      await api.put('/tutors/1', { availability: schedule });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update availability:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
        <p className="text-gray-600">Set your weekly teaching schedule</p>
      </div>

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
                'flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl transition-colors',
                slot.enabled ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
              )}
            >
              {/* Day Toggle */}
              <div className="flex items-center gap-3 md:w-40">
                <button
                  onClick={() => toggleDay(index)}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative',
                    slot.enabled ? 'bg-primary' : 'bg-gray-300'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                      slot.enabled ? 'left-7' : 'left-1'
                    )}
                  />
                </button>
                <span className="font-medium text-gray-900">{slot.day}</span>
              </div>

              {/* Time Selectors */}
              {slot.enabled && (
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">From:</label>
                    <select
                      value={slot.startTime}
                      onChange={(e) => updateTime(index, 'startTime', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">To:</label>
                    <select
                      value={slot.endTime}
                      onChange={(e) => updateTime(index, 'endTime', e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-sm text-gray-500">
                    {(() => {
                      const start = parseInt(slot.startTime);
                      const end = parseInt(slot.endTime);
                      return `${end - start} hours`;
                    })()}
                  </span>
                </div>
              )}

              {!slot.enabled && (
                <div className="flex-1">
                  <span className="text-sm text-gray-400">Not available</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="font-semibold text-gray-900 mb-3">Schedule Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">
              {availability.filter((s) => s.enabled).length}
            </p>
            <p className="text-sm text-gray-500">Days Available</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-gray-900">
              {availability.filter((s) => s.enabled).reduce((acc, s) => {
                return acc + (parseInt(s.endTime) - parseInt(s.startTime));
              }, 0)}
            </p>
            <p className="text-sm text-gray-500">Hours/Week</p>
          </div>
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
          {saving ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>
    </div>
  );
}
