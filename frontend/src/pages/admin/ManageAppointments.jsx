import React, { useEffect, useState } from 'react';
import { getAllAppointments, updateAppointmentStatus } from '../../services/bookingService';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusBadge = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100  text-green-800',
  cancelled: 'bg-gray-100   text-gray-600',
  completed: 'bg-blue-100   text-blue-800',
  rejected:  'bg-red-100    text-red-800',
};

export default function ManageAppointments() {
  const [appts,   setAppts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  const load = () => {
    setLoading(true);
    getAllAppointments()
      .then(r => setAppts(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await updateAppointmentStatus(id, status); load(); }
    catch (err) { alert(err.response?.data?.message || 'Update failed.'); }
  };

  const displayed = filter === 'all' ? appts : appts.filter(a => a.status === filter);

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-widest uppercase mb-1">Bookings</p>
        <h1 className="font-serif text-3xl text-charcoal font-bold">Manage Appointments</h1>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'cancelled', 'completed', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
              filter === s ? 'bg-cherry-red text-warm-white border-cherry-red' : 'text-charcoal border-gray-300 hover:border-cherry-red'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-warm-white border border-cream overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-cream bg-cream">
              <tr>
                {['ID', 'Customer', 'Bike', 'Type', 'Date & Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {displayed.map(a => (
                <tr key={a.id} className="hover:bg-cream transition-colors">
                  <td className="px-4 py-3 text-gray-500">#{a.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{a.customer_name}</p>
                    <p className="text-xs text-gray-400">{a.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">#{a.bike_id}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{a.appointment_type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <p>{a.appointment_date?.split('T')[0]}</p>
                    <p className="text-xs text-gray-400">{a.appointment_time?.slice(0,5)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-badge ${statusBadge[a.status] || ''}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {a.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(a.id, 'confirmed')}
                            className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 font-medium">Confirm</button>
                          <button onClick={() => updateStatus(a.id, 'rejected')}
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 font-medium">Reject</button>
                        </>
                      )}
                      {a.status === 'confirmed' && (
                        <button onClick={() => updateStatus(a.id, 'completed')}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium">Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No appointments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
