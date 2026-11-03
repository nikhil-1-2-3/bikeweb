require('dotenv').config();
const express               = require('express');
const cors                  = require('cors');
const helmet                = require('helmet');
const morgan                = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit             = require('express-rate-limit');
const services              = require('./config/services');

const app  = express();
const PORT = process.env.PORT || 4000;

// Trust proxy so rate limiter works correctly behind nginx / docker network
app.set('trust proxy', 1);

app.use(helmet());
app.use(morgan('combined'));

// CORS
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: 'Too many requests. Please try again later.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: 'Too many auth attempts. Please try again later.' },
});

app.use(limiter);
app.use('/api/auth', authLimiter);

// Health check
app.get('/health', async (req, res) => {
  const axios = require('axios');
  const checks = await Promise.allSettled([
    axios.get(`${services.AUTH_SERVICE}/health`,    { timeout: 3000 }),
    axios.get(`${services.BIKE_SERVICE}/health`,    { timeout: 3000 }),
    axios.get(`${services.BOOKING_SERVICE}/health`, { timeout: 3000 }),
  ]);
  const names    = ['auth-service', 'bike-service', 'booking-service'];
  const statuses = checks.map((c, i) => ({
    service: names[i],
    status:  c.status === 'fulfilled' ? 'ok' : 'unreachable',
  }));
  const allOk = statuses.every(s => s.status === 'ok');
  res.status(allOk ? 200 : 207).json({ status: allOk ? 'ok' : 'degraded', services: statuses });
});

// ─────────────────────────────────────────────────────────────────────────────
// http-proxy-middleware v3 API:
//  - app.use('/prefix', proxy) STRIPS the prefix before forwarding.
//  - To PRESERVE the full path, use pathFilter (not mounting at a sub-path).
//    pathFilter matches but does NOT strip — the full /api/... path is kept.
// ─────────────────────────────────────────────────────────────────────────────

const proxyError = (err, req, res, next) => {
  console.error('[Gateway] Proxy error:', err.message);
  if (res && typeof res.status === 'function' && !res.headersSent) {
    res.status(502).json({ error: true, message: 'Service temporarily unavailable.' });
  }
};

// Auth proxy — pathFilter preserves /api/auth/... on the upstream
app.use(createProxyMiddleware({
  target: services.AUTH_SERVICE,
  changeOrigin: true,
  pathFilter: '/api/auth',
  on: { error: proxyError },
}));

// Bike proxy
app.use(createProxyMiddleware({
  target: services.BIKE_SERVICE,
  changeOrigin: true,
  pathFilter: '/api/bikes',
  on: { error: proxyError },
}));

// Booking proxy
app.use(createProxyMiddleware({
  target: services.BOOKING_SERVICE,
  changeOrigin: true,
  pathFilter: '/api/appointments',
  on: { error: proxyError },
}));

// 404
app.use((req, res) =>
  res.status(404).json({ error: true, message: 'Gateway route not found.' })
);

app.listen(PORT, () => console.log(`[API Gateway] Running on port ${PORT}`));

module.exports = app;
