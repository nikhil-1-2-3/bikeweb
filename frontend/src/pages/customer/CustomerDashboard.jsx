import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyAppointments } from '../../services/bookingService';
import AppointmentCard from '../../components/AppointmentCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function CustomerDashboard() {
  const { user }          = useAuth();
  const [appts,  setAppts]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAppointments()
      .then(res => setAppts(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:     appts.length,
    pending:   appts.filter(a => a.status === 'pending').length,
    confirmed: appts.filter(a => a.status === 'confirmed').length,
  };

  const recent = appts.slice(0, 3);

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-gold text-xs tracking-widest uppercase mb-1">Welcome back</p>
        <h1 className="font-serif text-3xl text-charcoal font-bold">{user?.full_name}</h1>
        <p className="text-gray-500 text-sm mt-1">Here's an overview of your activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Appointments', value: stats.total,     color: 'text-charcoal' },
          { label: 'Pending',            value: stats.pending,   color: 'text-yellow-600' },
          { label: 'Confirmed',          value: stats.confirmed, color: 'text-green-600'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-warm-white border border-cream p-6">
            <p className="text-sm text-gray-500 mb-2">{label}</p>
            <p className={`font-serif text-4xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link to="/motorcycles" className="bg-charcoal text-warm-white p-6 hover:bg-opacity-90 transition-colors">
          <p className="text-gold text-xs tracking-widest uppercase mb-2">Explore</p>
          <h3 className="font-serif text-xl mb-1">Browse Motorcycles</h3>
          <p className="text-gray-400 text-sm">Discover our curated collection.</p>
        </Link>
        <Link to="/dashboard/book" className="bg-cherry-red text-warm-white p-6 hover:bg-burgundy transition-colors">
          <p className="text-red-200 text-xs tracking-widest uppercase mb-2">New Booking</p>
          <h3 className="font-serif text-xl mb-1">Book an Appointment</h3>
          <p className="text-red-200 text-sm">Schedule a showroom visit or test ride.</p>
        </Link>
      </div>

      {/* Recent appointments */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl text-charcoal">Recent Appointments</h2>
          <Link to="/dashboard/appointments" className="text-sm text-cherry-red hover:text-burgundy font-medium">
            View All →
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : recent.length === 0 ? (
          <div className="text-center py-12 bg-warm-white border border-cream">
            <p className="font-serif text-xl text-charcoal mb-2">No appointments yet</p>
            <p className="text-gray-500 text-sm mb-4">Book your first visit or test ride.</p>
            <Link to="/dashboard/book" className="btn-primary text-sm px-6 py-2">Book Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recent.map(a => <AppointmentCard key={a.id} appointment={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
