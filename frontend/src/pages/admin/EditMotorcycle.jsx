import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBikeById, updateBike } from '../../services/bikeService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function EditMotorcycle() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const [form,    setForm]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getBikeById(id)
      .then(r => setForm(r.data.data))
      .catch(() => setError('Motorcycle not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateBike(id, { ...form, price: parseFloat(form.price) });
      navigate('/admin/motorcycles');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !form) return <p className="text-cherry-red">{error}</p>;

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-widest uppercase mb-1">Inventory</p>
        <h1 className="font-serif text-3xl text-charcoal font-bold">Edit Motorcycle</h1>
      </div>

      {error && <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['name', 'Name *', 'text', true],
            ['brand', 'Brand *', 'text', true],
            ['model', 'Model *', 'text', true],
            ['price', 'Price (₹) *', 'number', true],
            ['engine_capacity', 'Engine Capacity', 'text', false],
            ['mileage', 'Mileage', 'text', false],
          ].map(([key, label, type, req]) => (
            <div key={key}>
              <label className="form-label">{label}</label>
              <input
                type={type} required={req}
                className="form-input"
                value={form[key] || ''}
                step={type === 'number' ? '0.01' : undefined}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}
          <div>
            <label className="form-label">Fuel Type</label>
            <select className="form-input" value={form.fuel_type} onChange={e => set('fuel_type', e.target.value)}>
              <option>Petrol</option><option>Electric</option><option>Hybrid</option>
            </select>
          </div>
          <div>
            <label className="form-label">Transmission</label>
            <select className="form-input" value={form.transmission} onChange={e => set('transmission', e.target.value)}>
              <option>Manual</option><option>Automatic</option><option>Semi-Automatic</option>
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Image URL</label>
          <input type="url" className="form-input" value={form.image_url || ''} onChange={e => set('image_url', e.target.value)} />
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={4} value={form.description || ''} onChange={e => set('description', e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="avail" checked={form.availability} onChange={e => set('availability', e.target.checked)} className="w-4 h-4 accent-cherry-red" />
          <label htmlFor="avail" className="text-sm font-medium text-charcoal">Available for booking</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary px-8 py-3 disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/admin/motorcycles')} className="btn-outline px-8 py-3">Cancel</button>
        </div>
      </form>
    </div>
  );
}
