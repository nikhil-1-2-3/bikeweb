import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBikes, deleteBike, toggleAvailability } from '../../services/bikeService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageMotorcycles() {
  const [bikes,   setBikes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const load = () => {
    setLoading(true);
    getAllBikes().then(r => setBikes(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try { await deleteBike(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed.'); }
  };

  const handleToggle = async (id, current) => {
    try { await toggleAvailability(id, !current); load(); }
    catch { alert('Update failed.'); }
  };

  const displayed = search
    ? bikes.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.brand.toLowerCase().includes(search.toLowerCase()))
    : bikes;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-gold text-xs tracking-widest uppercase mb-1">Inventory</p>
          <h1 className="font-serif text-3xl text-charcoal font-bold">Motorcycles</h1>
        </div>
        <Link to="/admin/motorcycles/add" className="btn-primary text-sm px-6 py-2.5">+ Add Motorcycle</Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text" placeholder="Search by name or brand..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="form-input max-w-sm text-sm py-2"
        />
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-warm-white border border-cream overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-cream bg-cream">
              <tr>
                {['ID', 'Name', 'Brand', 'Price', 'Engine', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {displayed.map(bike => (
                <tr key={bike.id} className="hover:bg-cream transition-colors">
                  <td className="px-4 py-3 text-gray-500">#{bike.id}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">{bike.name}</td>
                  <td className="px-4 py-3 text-gray-600">{bike.brand}</td>
                  <td className="px-4 py-3 font-semibold text-cherry-red">₹{Number(bike.price).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-600">{bike.engine_capacity || '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(bike.id, bike.availability)}
                      className={`status-badge cursor-pointer ${bike.availability ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {bike.availability ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link to={`/admin/motorcycles/${bike.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</Link>
                      <button onClick={() => handleDelete(bike.id, bike.name)} className="text-cherry-red hover:text-burgundy font-medium text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No motorcycles found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
