'use client';

import { useState } from 'react';
import { X, Calendar, Clock, Check, CreditCard } from 'lucide-react';
import api from '@/lib/axios';
import { cn } from '@/utils/helpers';
import PaymentForm from '@/components/payment/PaymentForm';
import type { Tutor } from '@/types';

interface BookingModalProps {
  tutor: Tutor;
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00',
];

export default function BookingModal({ tutor, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');

  const user = typeof tutor.userId === 'object' ? tutor.userId : null;

  // Get available days from tutor's availability
  const availableDays = tutor.availability.map((a) => a.day);

  // Generate next 14 days
  const generateDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getAvailableTimesForDate = (date: Date): string[] => {
    const dayName = getDayName(date);
    const availability = tutor.availability.find((a) => a.day === dayName);
    if (!availability) return [];

    const startHour = parseInt(availability.startTime.split(':')[0]);
    const endHour = parseInt(availability.endTime.split(':')[0]);

    return timeSlots.filter((slot) => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= startHour && hour < endHour;
    });
  };

  const handleCreateBooking = async () => {
    if (!selectedDate || !selectedTime || !subject) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/bookings', {
        tutorId: tutor._id,
        date: selectedDate.toISOString(),
        time: selectedTime,
        subject,
        notes,
      });
      setBookingId(response.data.data._id);
      setStep(4); // Move to payment step
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    resetModal();
    onClose();
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime('');
    setSubject('');
    setNotes('');
    setBookingId('');
    setError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 4 ? 'Payment' : 'Book a Session'}
            </h2>
            <p className="text-sm text-gray-500">with {user?.name || 'Tutor'}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          {step < 4 && (
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      step >= s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={cn('w-12 h-0.5', step > s ? 'bg-primary' : 'bg-gray-100')} />
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Select Date */}
          {step === 1 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Select a Date
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {dates.map((date) => {
                  const dayName = getDayName(date);
                  const isAvailable = availableDays.includes(dayName);
                  const isSelected = selectedDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => isAvailable && setSelectedDate(date)}
                      disabled={!isAvailable}
                      className={cn(
                        'p-2 rounded-xl text-center transition-all',
                        !isAvailable && 'opacity-30 cursor-not-allowed',
                        isSelected ? 'bg-primary text-white' : 'hover:bg-gray-50'
                      )}
                    >
                      <p className="text-xs text-gray-500">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className={cn('text-lg font-semibold', isSelected ? 'text-white' : 'text-gray-900')}>
                        {date.getDate()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Available on: {availableDays.join(', ')}
              </p>
            </div>
          )}

          {/* Step 2: Select Time */}
          {step === 2 && selectedDate && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Select a Time
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {getAvailableTimesForDate(selectedDate).map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                      selectedTime === time
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirm Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 mb-4">Confirm Booking Details</h3>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{selectedTime}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a subject</option>
                  {tutor.subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="What would you like to focus on?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div className="p-4 bg-primary/5 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Session Price</span>
                  <span className="text-xl font-bold text-gray-900">${tutor.hourlyRate}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <PaymentForm
              bookingId={bookingId}
              amount={tutor.hourlyRate}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setStep(3)}
            />
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedTime)}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleCreateBooking}
                  disabled={loading || !subject}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
