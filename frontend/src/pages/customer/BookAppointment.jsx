import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAllBikes } from '../../services/bikeService';
import { createAppointment } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00',
];

export default function BookAppointment() {
  const { user }          = useAuth();
  const navigate          = useNavigate();
  const [params]          = useSearchParams();
  const preselectedBikeId = params.get('bikeId');
  const preselectedType   = params.get('type');

  const [bikes,   setBikes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState('');

  const [form, setForm] = useState({
    bike_id:          preselectedBikeId || '',
    appointment_type: preselectedType || 'showroom_visit',
    appointment_date: '',
    appointment_time: '',
    customer_name:    user?.full_name || '',
    customer_phone:   user?.phone || '',
    notes:            '',
  });

  useEffect(() => {
    getAllBikes({ available: true })
      .then(res => setBikes(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Min date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.bike_id)          { setError('Please select a motorcycle.'); return; }
    if (!form.appointment_date) { setError('Please choose a date.'); return; }
    if (!form.appointment_time) { setError('Please choose a time slot.'); return; }

    setSubmitting(true);
    try {
      await createAppointment({
        ...form,
        appointment_time: form.appointment_time + ':00',
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-serif text-3xl text-charcoal mb-3">Appointment Booked!</h2>
      <p className="text-gray-500 mb-8">We'll confirm your appointment shortly. Check your dashboard for updates.</p>
      <div className="flex gap-4">
        <button onClick={() => navigate('/dashboard/appointments')} className="btn-primary px-6 py-2 text-sm">
          View Appointments
        </button>
        <button onClick={() => { setSuccess(false); setForm({ ...form, appointment_date: '', appointment_time: '', notes: '' }); }}
          className="btn-outline px-6 py-2 text-sm">
          Book Another
        </button>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-widest uppercase mb-1">New Booking</p>
        <h1 className="font-serif text-3xl text-charcoal font-bold">Book an Appointment</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">

        {/* Motorcycle */}
        <div>
          <label className="form-label">Select Motorcycle *</label>
          <select
            value={form.bike_id}
            onChange={e => setForm({ ...form, bike_id: e.target.value })}
            className="form-input"
            required
          >
            <option value="">-- Choose a motorcycle --</option>
            {bikes.map(b => (
              <option key={b.id} value={b.id}>{b.brand} {b.name}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="form-label">Appointment Type *</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'showroom_visit', label: 'Showroom Visit',  desc: 'Come see it in person' },
              { value: 'test_ride',      label: 'Test Ride',        desc: 'Take it for a spin' },
            ].map(({ value, label, desc }) => (
              <button
                key={value} type="button"
                onClick={() => setForm({ ...form, appointment_type: value })}
                className={`p-4 border-2 text-left transition-colors ${
                  form.appointment_type === value
                    ? 'border-cherry-red bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-sm text-charcoal">{label}</p>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="form-label">Preferred Date *</label>
          <input
            type="date" className="form-input"
            min={minDateStr}
            value={form.appointment_date}
            onChange={e => setForm({ ...form, appointment_date: e.target.value, appointment_time: '' })}
            required
          />
        </div>

        {/* Time */}
        {form.appointment_date && (
          <div>
            <label className="form-label">Preferred Time *</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot} type="button"
                  onClick={() => setForm({ ...form, appointment_time: slot })}
                  className={`py-2 text-sm font-medium border transition-colors ${
                    form.appointment_time === slot
                      ? 'bg-cherry-red text-warm-white border-cherry-red'
                      : 'border-gray-200 text-charcoal hover:border-cherry-red'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Your Name *</label>
            <input type="text" className="form-input" required value={form.customer_name}
              onChange={e => setForm({ ...form, customer_name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Phone *</label>
            <input type="tel" className="form-input" required value={form.customer_phone}
              onChange={e => setForm({ ...form, customer_phone: e.target.value })} />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="form-label">Notes (optional)</label>
          <textarea className="form-input" rows={3} value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Any special requests or questions..." />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base disabled:opacity-60">
          {submitting ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
}
