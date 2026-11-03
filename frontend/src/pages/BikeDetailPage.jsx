import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { getBikeById } from '../services/bikeService';
import { useAuth } from '../context/AuthContext';

export default function BikeDetailPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bike,    setBike]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getBikeById(id)
      .then(res => setBike(res.data.data))
      .catch(() => setError('Motorcycle not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = (type) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate(`/dashboard/book?bikeId=${id}&type=${type}`);
  };

  if (loading) return <div className="pt-16"><LoadingSpinner /></div>;
  if (error)   return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-serif text-2xl text-charcoal mb-4">{error}</p>
        <Link to="/motorcycles" className="btn-primary">Back to Showroom</Link>
      </div>
    </div>
  );

  const specs = [
    ['Engine',       bike.engine_capacity],
    ['Mileage',      bike.mileage],
    ['Fuel Type',    bike.fuel_type],
    ['Transmission', bike.transmission],
    ['Brand',        bike.brand],
    ['Model',        bike.model],
  ].filter(([, v]) => v);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero image */}
      <div className="relative h-80 md:h-[28rem] bg-charcoal overflow-hidden">
        <img
          src={bike.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200'}
          alt={bike.name}
          className="w-full h-full object-cover opacity-70"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <p className="text-gold text-xs tracking-widest uppercase mb-1">{bike.brand}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-warm-white">{bike.name}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left — details */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6">
              <Link to="/motorcycles" className="hover:text-cherry-red transition-colors">Motorcycles</Link>
              <span className="mx-2">/</span>
              <span className="text-charcoal">{bike.name}</span>
            </nav>

            {/* Description */}
            {bike.description && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl text-charcoal mb-3">About This Machine</h2>
                <p className="text-gray-600 leading-relaxed">{bike.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-px bg-cream border border-cream">
                {specs.map(([label, value]) => (
                  <div key={label} className="bg-warm-white px-5 py-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                    <p className="font-semibold text-charcoal">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className={`status-badge ${bike.availability ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {bike.availability ? '✓ Available' : '✗ Not Available'}
                </span>
              </div>
              <p className="font-serif text-4xl font-bold text-cherry-red my-4">
                ₹{Number(bike.price).toLocaleString('en-IN')}
              </p>
              <p className="text-gray-500 text-xs mb-6">Ex-showroom price. Road tax & insurance extra.</p>

              {bike.availability ? (
                <div className="space-y-3">
                  <button onClick={() => handleBook('showroom_visit')} className="w-full btn-primary py-3 text-sm">
                    Book Showroom Visit
                  </button>
                  <button onClick={() => handleBook('test_ride')} className="w-full btn-outline py-3 text-sm">
                    Schedule Test Ride
                  </button>
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm py-4 border border-dashed border-gray-300">
                  Currently unavailable. Check back soon.
                </p>
              )}

              <div className="mt-6 pt-5 border-t border-cream space-y-2 text-sm text-gray-500">
                <p>📞 +91 99999 99999</p>
                <p>🕐 Mon–Sat 10AM–7PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
