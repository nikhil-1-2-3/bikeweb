import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wider uppercase transition-colors duration-150 ${
      isActive ? 'text-cherry-red' : 'text-charcoal hover:text-cherry-red'
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''} bg-warm-white border-b border-cream`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none" onClick={() => setMenuOpen(false)}>
            <span className="font-serif text-xl font-bold text-charcoal tracking-tight">THE MOTOR HOUSE</span>
            <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-medium">The Art of the Ride</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/motorcycles" className={linkClass}>Motorcycles</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-charcoal hover:text-cherry-red transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-cherry-red text-warm-white flex items-center justify-center text-xs font-bold uppercase">
                    {user?.full_name?.[0] || 'U'}
                  </span>
                  <span>{user?.full_name?.split(' ')[0]}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-warm-white border border-cream shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-cream">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-charcoal truncate">{user?.email}</p>
                    </div>
                    {isAdmin ? (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-charcoal hover:bg-cream transition-colors">Admin Dashboard</Link>
                    ) : (
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-charcoal hover:bg-cream transition-colors">My Dashboard</Link>
                    )}
                    <Link to={isAdmin ? "/admin" : "/dashboard/profile"} onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-charcoal hover:bg-cream transition-colors">Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-cherry-red hover:bg-cream transition-colors border-t border-cream">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-charcoal hover:text-cherry-red transition-colors tracking-wide uppercase">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-5">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-charcoal" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-warm-white border-t border-cream px-4 py-4 space-y-3">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/motorcycles" className={linkClass} onClick={() => setMenuOpen(false)}>Motorcycles</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setMenuOpen(false)}>Contact</NavLink>
          <div className="pt-3 border-t border-cream flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-charcoal">Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-cherry-red">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-charcoal">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm text-center py-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
