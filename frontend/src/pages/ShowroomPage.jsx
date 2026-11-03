import React, { useEffect, useState } from 'react';
import MotorcycleCard from '../components/MotorcycleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllBikes } from '../services/bikeService';

const BRANDS = ['All', 'Harley-Davidson', 'Royal Enfield', 'Triumph', 'Indian', 'BMW'];

export default function ShowroomPage() {
  const [bikes,     setBikes]     = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [brand,     setBrand]     = useState('All');
  const [available, setAvailable] = useState(false);
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    getAllBikes()
      .then(res => { setBikes(res.data.data); setFiltered(res.data.data); })
      .catch(() => setError('Failed to load motorcycles.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = [...bikes];
    if (brand !== 'All') list = list.filter(b => b.brand === brand);
    if (available)        list = list.filter(b => b.availability);
    if (search.trim())    list = list.filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.brand.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [brand, available, search, bikes]);

  return (
    <div className="min-h-screen bg-warm-white">

      {/* Header */}
      <div className="bg-charcoal py-20 px-4 text-center">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Our Collection</p>
        <h1 className="font-serif text-5xl font-bold text-warm-white mb-4">The Showroom</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Explore every machine in our curated collection. Filter by brand, price or availability.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-10 pb-6 border-b border-cream">
          <div className="flex flex-wrap gap-2">
            {BRANDS.map(b => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors border ${
                  brand === b
                    ? 'bg-cherry-red text-warm-white border-cherry-red'
                    : 'text-charcoal border-gray-300 hover:border-cherry-red hover:text-cherry-red'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="form-input w-48 text-sm py-2"
            />
            <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer select-none">
              <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)}
                className="accent-cherry-red w-4 h-4" />
              Available only
            </label>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-center text-cherry-red py-12">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-charcoal mb-2">No motorcycles found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">{filtered.length} motorcycle{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filtered.map(bike => <MotorcycleCard key={bike.id} bike={bike} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
