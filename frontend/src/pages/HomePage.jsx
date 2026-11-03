import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MotorcycleCard from '../components/MotorcycleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllBikes } from '../services/bikeService';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getAllBikes({ available: true })
      .then(res => setFeatured(res.data.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-warm-white">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-charcoal overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600"
            alt="Motorcycle"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-medium mb-6">
              Premium Motorcycle Showroom
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-warm-white leading-tight mb-4">
              THE MOTOR<br />HOUSE
            </h1>
            <p className="font-serif text-2xl text-gold italic mb-6">The Art of the Ride</p>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
              Where legendary machines meet the roads they were born for. Explore our curated collection of the world's finest motorcycles.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/motorcycles" className="btn-primary text-base px-8 py-4">
                Explore Motorcycles
              </Link>
              <Link to="/dashboard/book" className="btn-outline text-base px-8 py-4">
                Book a Test Ride
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-gray-500 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="bg-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ['50+', 'Models Available'],
              ['12+', 'Premium Brands'],
              ['500+', 'Happy Riders'],
              ['10+', 'Years of Expertise'],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-serif text-4xl text-cherry-red font-bold">{num}</p>
                <p className="text-gray-600 text-sm mt-1 tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED MOTORCYCLES ─────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-subtitle">Hand-Picked Selection</p>
          <h2 className="section-title">Featured Machines</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every motorcycle in our showroom is chosen for its character, performance, and the story it tells.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map(bike => <MotorcycleCard key={bike.id} bike={bike} />)}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/motorcycles" className="btn-outline px-10 py-3">
            View Full Collection
          </Link>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────── */}
      <section className="bg-charcoal text-warm-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Our Promise</p>
            <h2 className="font-serif text-4xl font-bold">Why The Motor House</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Curated Collection',
                desc: 'Every bike on our floor is vetted for quality, performance and character. We stock only machines worth owning.',
                icon: '🏆',
              },
              {
                title: 'Expert Guidance',
                desc: 'Our team of passionate riders helps you find the perfect match — whether you are a first-timer or a seasoned veteran.',
                icon: '🔧',
              },
              {
                title: 'Test Ride Programme',
                desc: 'Book a test ride and feel the machine before you commit. Because great motorcycles are meant to be experienced.',
                icon: '🏍️',
              },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-cream">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="bg-cherry-red py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-warm-white mb-4">
            Find Your Perfect Ride
          </h2>
          <p className="text-red-100 text-lg mb-8">
            Visit our showroom or book a test ride today.
          </p>
          <Link to="/motorcycles" className="inline-block bg-warm-white text-cherry-red px-10 py-4 font-bold text-sm tracking-wider uppercase hover:bg-cream transition-colors">
            Browse Motorcycles
          </Link>
        </div>
      </section>

    </div>
  );
}
