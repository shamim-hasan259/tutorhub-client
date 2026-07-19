'use client';

import { useState } from 'react';
import { CreditCard, Lock, Check, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import { formatCurrency } from '@/utils/helpers';
import { cn } from '@/utils/helpers';

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({ bookingId, amount, onSuccess, onCancel }: PaymentFormProps) {
  const [step, setStep] = useState<'card' | 'processing' | 'success'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [error, setError] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (cardData.number.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid card number');
      return;
    }
    if (cardData.expiry.length < 5) {
      setError('Please enter a valid expiry date');
      return;
    }
    if (cardData.cvc.length < 3) {
      setError('Please enter a valid CVC');
      return;
    }
    if (!cardData.name.trim()) {
      setError('Please enter the cardholder name');
      return;
    }

    setStep('processing');

    try {
      // Create payment
      const paymentResponse = await api.post('/payments', {
        bookingId,
        amount,
        paymentMethod: 'card',
      });

      // Simulate payment processing (in production, this would be Stripe)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update payment status to completed
      await api.patch(`/payments/${paymentResponse.data.data._id}/status`, {
        status: 'completed',
        stripePaymentId: `sim_${Date.now()}`,
      });

      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setStep('card');
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  if (step === 'success') {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
        <p className="text-sm text-gray-500">Redirecting...</p>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h3>
        <p className="text-gray-600">Please do not close this window...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
          <p className="text-sm text-gray-500">Secure payment powered by Stripe</p>
        </div>
      </div>

      {/* Amount */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Session Booking</span>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(amount)}</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Card Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
          <input
            type="text"
            value={cardData.name}
            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="text"
              value={cardData.expiry}
              onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
            <input
              type="text"
              value={cardData.cvc}
              onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              placeholder="123"
              maxLength={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
      >
        Pay {formatCurrency(amount)}
      </button>

      {/* Demo Card Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-700 font-medium mb-1">Demo Mode</p>
        <p className="text-xs text-blue-600">
          Use card: 4242 4242 4242 4242 | Expiry: 12/34 | CVC: 123
        </p>
      </div>
    </form>
  );
}
