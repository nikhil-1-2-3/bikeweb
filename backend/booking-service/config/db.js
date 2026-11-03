const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST       || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.BOOKING_DB_NAME || 'booking_db',
  user:     process.env.DB_USER       || 'postgres',
  password: process.env.DB_PASSWORD   || 'postgres',
  max:      10,
  idleTimeoutMillis:    30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[Booking DB] Unexpected pool error:', err.message);
});

module.exports = pool;
