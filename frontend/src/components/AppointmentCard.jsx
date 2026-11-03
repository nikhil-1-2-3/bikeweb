import React from 'react';

const statusConfig = {
  pending:   { label: 'Pending',   classes: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', classes: 'bg-green-100  text-green-800'  },
  cancelled: { label: 'Cancelled', classes: 'bg-gray-100   text-gray-600'   },
  completed: { label: 'Completed', classes: 'bg-blue-100   text-blue-800'   },
  rejected:  { label: 'Rejected',  classes: 'bg-red-100    text-red-800'    },
};

export default function AppointmentCard({ appointment, onCancel }) {
  const cfg  = statusConfig[appointment.status] || statusConfig.pending;
  const type = appointment.appointment_type === 'test_ride' ? 'Test Ride' : 'Showroom Visit';

  const formattedDate = new Date(appointment.appointment_date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const formattedTime = appointment.appointment_time
    ? appointment.appointment_time.slice(0, 5)
    : '';

  const canCancel = ['pending', 'confirmed'].includes(appointment.status);

  return (
    <div className="card p-5 flex flex-col sm:flex-row sm:items-start gap-4">
      {/* Type icon */}
      <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center flex-shrink-0">
        {appointment.appointment_type === 'test_ride' ? (
          <svg className="w-6 h-6 text-cherry-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-cherry-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3" />
          </svg>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-serif text-lg text-charcoal font-semibold">{type}</h3>
          <span className={`status-badge ${cfg.classes}`}>{cfg.label}</span>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Bike ID:</span> #{appointment.bike_id}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Date:</span> {formattedDate}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Time:</span> {formattedTime}
        </p>
        {appointment.notes && (
          <p className="text-sm text-gray-500 mt-2 italic">"{appointment.notes}"</p>
        )}
      </div>

      {/* Cancel button */}
      {canCancel && onCancel && (
        <button
          onClick={() => onCancel(appointment.id)}
          className="self-start text-sm text-cherry-red hover:text-burgundy font-medium transition-colors border border-cherry-red px-3 py-1 hover:bg-cherry-red hover:text-white"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
