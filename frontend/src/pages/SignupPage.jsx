import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form,    setForm]    = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }

    setLoading(true);
    try {
      await register({ full_name: form.full_name, email: form.email, phone: form.phone, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', placeholder = '', autocomplete = '') => (
    <div>
      <label className="form-label">{label}</label>
      <input
        type={type} className="form-input"
        required={name !== 'phone'}
        value={form[name]}
        onChange={e => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        autoComplete={autocomplete}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="font-serif text-3xl font-bold text-charcoal">THE MOTOR HOUSE</h1>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mt-1">The Art of the Ride</p>
          </Link>
        </div>

        <div className="bg-warm-white border border-cream p-8 shadow-sm">
          <h2 className="font-serif text-2xl text-charcoal mb-6">Create Account</h2>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {field('full_name', 'Full Name',         'text',     'John Doe',            'name')}
            {field('email',     'Email Address',     'email',    'you@example.com',     'email')}
            {field('phone',     'Phone (optional)',  'tel',      '+91 XXXXX XXXXX',     'tel')}
            {field('password',  'Password',          'password', '••••••••',            'new-password')}
            {field('confirm',   'Confirm Password',  'password', '••••••••',            'new-password')}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-cherry-red font-medium hover:text-burgundy">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
