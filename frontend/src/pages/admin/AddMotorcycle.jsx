import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBike } from '../../services/bikeService';

const empty = {
  name: '', brand: '', model: '', description: '', price: '',
  engine_capacity: '', mileage: '', fuel_type: 'Petrol', transmission: 'Manual',
  image_url: '', availability: true,
};

export default function AddMotorcycle() {
  const navigate    = useNavigate();
  const [form,    setForm]    = useState(empty);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createBike({ ...form, price: parseFloat(form.price) });
      navigate('/admin/motorcycles');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create motorcycle.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-widest uppercase mb-1">Inventory</p>
        <h1 className="font-serif text-3xl text-charcoal font-bold">Add Motorcycle</h1>
      </div>

      {error && <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Name *</label>
            <input type="text" required className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="form-label">Brand *</label>
            <input type="text" required className="form-input" value={form.brand} onChange={e => set('brand', e.target.value)} />
          </div>
          <div>
            <label className="form-label">Model *</label>
            <input type="text" required className="form-input" value={form.model} onChange={e => set('model', e.target.value)} />
          </div>
          <div>
            <label className="form-label">Price (₹) *</label>
            <input type="number" required step="0.01" min="0" className="form-input" value={form.price} onChange={e => set('price', e.target.value)} />
          </div>
          <div>
            <label className="form-label">Engine Capacity</label>
            <input type="text" className="form-input" value={form.engine_capacity} onChange={e => set('engine_capacity', e.target.value)} placeholder="e.g. 1200cc" />
          </div>
          <div>
            <label className="form-label">Mileage</label>
            <input type="text" className="form-input" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder="e.g. 20 kmpl" />
          </div>
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
          <input type="url" className="form-input" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." />
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="avail" checked={form.availability} onChange={e => set('availability', e.target.checked)} className="w-4 h-4 accent-cherry-red" />
          <label htmlFor="avail" className="text-sm font-medium text-charcoal">Available for booking</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary px-8 py-3 disabled:opacity-60">
            {saving ? 'Saving...' : 'Add Motorcycle'}
          </button>
          <button type="button" onClick={() => navigate('/admin/motorcycles')} className="btn-outline px-8 py-3">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
