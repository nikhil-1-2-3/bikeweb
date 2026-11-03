import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CustomerLinks = () => (
  <>
    <SideLink to="/dashboard"              label="Overview"        icon="grid"    end />
    <SideLink to="/dashboard/appointments" label="My Appointments" icon="calendar" />
    <SideLink to="/dashboard/book"         label="Book Appointment" icon="plus"   />
    <SideLink to="/dashboard/profile"      label="My Profile"      icon="user"    />
  </>
);

const AdminLinks = () => (
  <>
    <SideLink to="/admin"                  label="Overview"         icon="grid"    end />
    <SideLink to="/admin/motorcycles"      label="Motorcycles"      icon="bike"    />
    <SideLink to="/admin/motorcycles/add"  label="Add Motorcycle"   icon="plus"    />
    <SideLink to="/admin/appointments"     label="Appointments"     icon="calendar"/>
    <SideLink to="/admin/customers"        label="Customers"        icon="users"   />
  </>
);

function SideLink({ to, label, icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
          isActive
            ? 'bg-cherry-red text-warm-white'
            : 'text-charcoal hover:bg-cream hover:text-cherry-red'
        }`
      }
    >
      <Icon name={icon} />
      {label}
    </NavLink>
  );
}

function Icon({ name }) {
  const paths = {
    grid:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    plus:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />,
    user:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    bike:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />,
    users:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
  };
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

export default function DashboardLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate   = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-warm-white border-r border-cream flex flex-col transform transition-transform duration-200
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex`}>

        {/* Logo */}
        <div className="px-4 py-5 border-b border-cream">
          <Link to="/" className="block">
            <span className="font-serif text-base font-bold text-charcoal">THE MOTOR HOUSE</span>
            <span className="block text-[9px] tracking-[0.3em] text-gold uppercase mt-0.5">
              {isAdmin ? 'Admin Panel' : 'Customer Portal'}
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {isAdmin ? <AdminLinks /> : <CustomerLinks />}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-cream p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-cherry-red text-warm-white flex items-center justify-center text-xs font-bold uppercase">
              {user?.full_name?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-charcoal truncate">{user?.full_name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left text-xs text-cherry-red hover:text-burgundy font-medium transition-colors">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sideOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setSideOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-warm-white border-b border-cream px-4 h-14">
          <button onClick={() => setSideOpen(true)} className="text-charcoal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-serif text-sm font-bold text-charcoal">THE MOTOR HOUSE</span>
          <div className="w-6" />
        </div>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
