import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/authService';

export default function MyProfile() {
  const { user, refreshProfile } = useAuth();

  const [form,    setForm]    = useState({ full_name: user?.full_name || '', phone: user?.phone || '' });
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      await updateProfile(form);
      await refreshProfile();
      setMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-widest uppercase mb-1">Account</p>
        <h1 className="font-serif text-3xl text-charcoal font-bold">My Profile</h1>
      </div>

      <div className="max-w-lg">
        {/* Read-only info */}
        <div className="bg-warm-white border border-cream p-6 mb-6">
          <h2 className="font-serif text-lg text-charcoal mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-charcoal">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className="font-medium text-charcoal capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Member Since</span>
              <span className="font-medium text-charcoal">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN') : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Editable form */}
        <div className="bg-warm-white border border-cream p-6">
          <h2 className="font-serif text-lg text-charcoal mb-5">Edit Profile</h2>

          {msg.text && (
            <div className={`mb-4 p-3 text-sm ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" required className="form-input"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input type="tel" className="form-input"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full py-3 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
