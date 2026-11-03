import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MotorcycleCard({ bike }) {
  const navigate        = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBookRide = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/dashboard/book?bikeId=${bike.id}`);
  };

  return (
    <div className="card group flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden h-52 bg-cream">
        <img
          src={bike.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'}
          alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'; }}
        />
        {/* Availability badge */}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 ${
          bike.availability ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'
        }`}>
          {bike.availability ? 'Available' : 'Sold Out'}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-gold text-xs tracking-widest uppercase font-medium mb-1">{bike.brand}</p>
        <h3 className="font-serif text-xl text-charcoal font-semibold mb-1">{bike.name}</h3>
        <p className="text-gray-500 text-xs mb-3 flex items-center gap-2">
          {bike.engine_capacity && <span>{bike.engine_capacity}</span>}
          {bike.transmission && <><span>·</span><span>{bike.transmission}</span></>}
        </p>
        <p className="text-2xl font-bold text-cherry-red mt-auto mb-4">
          ₹{Number(bike.price).toLocaleString('en-IN')}
        </p>

        <div className="flex gap-2">
          <Link
            to={`/motorcycles/${bike.id}`}
            className="flex-1 text-center btn-charcoal text-sm py-2"
          >
            View Details
          </Link>
          {bike.availability && (
            <button
              onClick={handleBookRide}
              className="flex-1 btn-primary text-sm py-2"
            >
              Book Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
