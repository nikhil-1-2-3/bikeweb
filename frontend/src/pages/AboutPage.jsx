import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-white">

      {/* Header */}
      <div className="bg-charcoal py-24 px-4 text-center">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Our Story</p>
        <h1 className="font-serif text-5xl font-bold text-warm-white mb-4">About Us</h1>
      </div>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-subtitle">Est. 2014</p>
            <h2 className="section-title">Passion Driven, Rider Focused</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Motor House was founded by a group of motorcycle enthusiasts who believed that buying a motorcycle should be as extraordinary as riding one.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We curate only the finest machines from legendary brands — from the thunderous American classics of Harley-Davidson to the refined British heritage of Triumph, the raw soul of Royal Enfield, and the cutting-edge engineering of BMW Motorrad.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every motorcycle we stock is selected for its craftsmanship, character, and the experience it delivers. We are not just a dealership — we are a destination.
            </p>
          </div>
          <div className="bg-cream h-80 flex items-center justify-center">
            <div className="text-center text-charcoal/30">
              <p className="font-serif text-6xl">🏍️</p>
              <p className="font-serif text-lg mt-4">The Motor House</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-subtitle">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Authenticity', desc: 'We stock only genuine, verified motorcycles from authorised brand channels. No compromises on provenance.' },
              { title: 'Excellence',  desc: 'From the machines we carry to the service we provide — everything we do is held to the highest standard.' },
              { title: 'Community',   desc: 'Riding is more than transport. We foster a community of passionate riders through events, rides, and shared stories.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-warm-white p-8 border border-cream">
                <div className="w-10 h-0.5 bg-cherry-red mb-5" />
                <h3 className="font-serif text-xl text-charcoal mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="font-serif text-3xl text-charcoal mb-4">Come See Us</h2>
        <p className="text-gray-500 mb-8">Visit our showroom or book a test ride today.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/motorcycles" className="btn-primary px-8 py-3">View Motorcycles</Link>
          <Link to="/contact" className="btn-outline px-8 py-3">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
