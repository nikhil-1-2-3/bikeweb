import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-2">THE MOTOR HOUSE</h2>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">The Art of the Ride</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              A curated destination for discerning motorcycle enthusiasts. We bring together the world's finest machines and the expertise to match.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-cream">Quick Links</h3>
            <ul className="space-y-3">
              {[
                ['Motorcycles', '/motorcycles'],
                ['About Us',    '/about'],
                ['Contact',     '/contact'],
                ['Book a Test Ride', '/dashboard/book'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-gray-400 text-sm hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg mb-6 text-cream">Visit Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>123 Heritage Boulevard</li>
              <li>Classic Quarter, Mumbai 400001</li>
              <li className="pt-2">
                <a href="tel:+919999999999" className="hover:text-gold transition-colors">+91 99999 99999</a>
              </li>
              <li>
                <a href="mailto:hello@motorhouse.com" className="hover:text-gold transition-colors">hello@motorhouse.com</a>
              </li>
              <li className="pt-2 text-xs text-gray-500">Mon – Sat: 10:00 AM – 7:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} The Motor House. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">Crafted for those who ride.</p>
        </div>
      </div>
    </footer>
  );
}
