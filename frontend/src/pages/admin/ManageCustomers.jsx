import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/authService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageCustomers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    getAllUsers()
      .then(r => setUsers(r.data.data.filter(u => u.role === 'customer')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayed = search
    ? users.filter(u =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-widest uppercase mb-1">Users</p>
        <h1 className="font-serif text-3xl text-charcoal font-bold">Customers</h1>
      </div>

      <div className="mb-6">
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="form-input max-w-sm text-sm py-2"
        />
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-warm-white border border-cream overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-cream bg-cream">
              <tr>
                {['ID', 'Full Name', 'Email', 'Phone', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream">
              {displayed.map(u => (
                <tr key={u.id} className="hover:bg-cream transition-colors">
                  <td className="px-4 py-3 text-gray-500">#{u.id}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">{u.full_name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(u.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
