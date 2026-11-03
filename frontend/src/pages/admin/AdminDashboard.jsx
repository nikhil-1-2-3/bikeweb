import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBikes } from '../../services/bikeService';
import { getAllAppointments } from '../../services/bookingService';
import { getAllUsers } from '../../services/authService';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusBadge = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100  text-green-800',
  cancelled: 'bg-gray-100   text-gray-600',
  completed: 'bg-blue-100   text-blue-800',
  rejected:  'bg-red-100    text-red-800',
};

export default function AdminDashboard() {
  const [bikes,   setBikes]   = useState([]);
  const [appts,   setAppts]   = useState([]);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllBikes(), getAllAppointments(), getAllUsers()])
      .then(([b, a, u]) => {
        setBikes(b.data.data);
        setAppts(a.data.data);
        setUsers(u.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const today       = new Date().toISOString().split('T')[0];
  const todayAppts  = appts.filter(a => a.appointment_date?.startsWith(today));
  const pendingAppts = appts.filter(a => a.status === 'pending');
  const customers   = users.filter(u => u.role === 'customer');

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-widest uppercase mb-1">Admin Panel</p>
        <h1 className="font-serif text-3xl text-charcoal font-bold">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Motorcycles',       value: bikes.length,        color: 'text-charcoal'  },
          { label: 'Customers',         value: customers.length,    color: 'text-charcoal'  },
          { label: 'Pending Bookings',  value: pendingAppts.length, color: 'text-yellow-600' },
          { label: "Today's Bookings",  value: todayAppts.length,   color: 'text-cherry-red' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-warm-white border border-cream p-5">
            <p className="text-xs text-gray-500 mb-2">{label}</p>
            <p className={`font-serif text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link to="/admin/motorcycles"     className="bg-charcoal text-warm-white p-5 hover:bg-opacity-90 transition-colors">
          <p className="font-serif text-base">Manage Motorcycles →</p>
        </Link>
        <Link to="/admin/appointments"    className="bg-cherry-red text-warm-white p-5 hover:bg-burgundy transition-colors">
          <p className="font-serif text-base">Manage Appointments →</p>
        </Link>
        <Link to="/admin/customers"       className="bg-cream text-charcoal p-5 hover:bg-gold/20 transition-colors border border-cream">
          <p className="font-serif text-base">View Customers →</p>
        </Link>
      </div>

      {/* Recent appointments table */}
      <div>
        <h2 className="font-serif text-xl text-charcoal mb-4">Recent Appointments</h2>
        <div className="bg-warm-white border border-cream overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-cream bg-cream">
              <tr>
                {['ID', 'Customer', 'Bike', 'Type', 'Date', 'Time', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {appts.slice(0, 10).map(a => (
                <tr key={a.id} className="hover:bg-cream transition-colors">
                  <td className="px-4 py-3 text-gray-500">#{a.id}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">{a.customer_name}</td>
                  <td className="px-4 py-3 text-gray-600">#{a.bike_id}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{a.appointment_type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-gray-600">{a.appointment_date?.split('T')[0]}</td>
                  <td className="px-4 py-3 text-gray-600">{a.appointment_time?.slice(0,5)}</td>
                  <td className="px-4 py-3">
                    <span className={`status-badge ${statusBadge[a.status] || 'bg-gray-100 text-gray-600'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {appts.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No appointments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
