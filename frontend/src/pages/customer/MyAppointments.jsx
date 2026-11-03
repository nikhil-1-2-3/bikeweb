import React, { useEffect, useState } from 'react';
import AppointmentCard from '../../components/AppointmentCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getMyAppointments, cancelAppointment } from '../../services/bookingService';

const STATUSES = ['all', 'pending', 'confirmed', 'cancelled', 'completed', 'rejected'];

export default function MyAppointments() {
  const [appts,   setAppts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [error,   setError]   = useState('');

  const load = () => {
    setLoading(true);
    getMyAppointments()
      .then(res => setAppts(res.data.data))
      .catch(() => setError('Failed to load appointments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel.');
    }
  };

  const displayed = filter === 'all' ? appts : appts.filter(a => a.status === filter);

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-widest uppercase mb-1">Bookings</p>
        <h1 className="font-serif text-3xl text-charcoal font-bold">My Appointments</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors border ${
              filter === s
                ? 'bg-cherry-red text-warm-white border-cherry-red'
                : 'text-charcoal border-gray-300 hover:border-cherry-red'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-cherry-red text-sm">{error}</p>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 bg-warm-white border border-cream">
          <p className="font-serif text-xl text-charcoal">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map(a => <AppointmentCard key={a.id} appointment={a} onCancel={handleCancel} />)}
        </div>
      )}
    </div>
  );
}
