import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-warm-white">

      {/* Header */}
      <div className="bg-charcoal py-24 px-4 text-center">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Get In Touch</p>
        <h1 className="font-serif text-5xl font-bold text-warm-white mb-4">Contact Us</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Info */}
          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-6">Visit the Showroom</h2>
            <div className="space-y-6 text-gray-600">
              <div>
                <p className="font-semibold text-charcoal mb-1">Address</p>
                <p>123 Heritage Boulevard</p>
                <p>Classic Quarter, Mumbai 400001</p>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Phone</p>
                <a href="tel:+919999999999" className="hover:text-cherry-red transition-colors">+91 99999 99999</a>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Email</p>
                <a href="mailto:hello@motorhouse.com" className="hover:text-cherry-red transition-colors">hello@motorhouse.com</a>
              </div>
              <div>
                <p className="font-semibold text-charcoal mb-1">Hours</p>
                <p>Monday – Saturday: 10:00 AM – 7:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-6">Send a Message</h2>
            {sent && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
                Thank you! We will get back to you shortly.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div>
                <label className="form-label">Phone (optional)</label>
                <input className="form-input" type="tel" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={5} required value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" />
              </div>
              <button type="submit" className="btn-primary w-full py-3">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
