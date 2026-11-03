require('dotenv').config();
const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const morgan         = require('morgan');
const bookingRoutes  = require('./routes/bookingRoutes');
const errorHandler   = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 4003;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'booking-service', timestamp: new Date().toISOString() })
);

app.use('/api/appointments', bookingRoutes);

app.use((req, res) =>
  res.status(404).json({ error: true, message: 'Route not found.' })
);

app.use(errorHandler);

app.listen(PORT, () => console.log(`[Booking Service] Running on port ${PORT}`));

module.exports = app;
