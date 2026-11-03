require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const bikeRoutes   = require('./routes/bikeRoutes');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 4002;

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'bike-service', timestamp: new Date().toISOString() })
);

app.use('/api/bikes', bikeRoutes);

app.use((req, res) =>
  res.status(404).json({ error: true, message: 'Route not found.' })
);

app.use(errorHandler);

app.listen(PORT, () => console.log(`[Bike Service] Running on port ${PORT}`));

module.exports = app;
