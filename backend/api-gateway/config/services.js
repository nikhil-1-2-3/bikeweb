module.exports = {
  AUTH_SERVICE:    process.env.AUTH_SERVICE_URL    || 'http://localhost:4001',
  BIKE_SERVICE:    process.env.BIKE_SERVICE_URL    || 'http://localhost:4002',
  BOOKING_SERVICE: process.env.BOOKING_SERVICE_URL || 'http://localhost:4003',
};
