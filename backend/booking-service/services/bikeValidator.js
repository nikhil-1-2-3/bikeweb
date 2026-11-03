const axios = require('axios');

const BIKE_SERVICE_URL = process.env.BIKE_SERVICE_URL || 'http://localhost:4002';

/**
 * Verify that a bike exists and is available.
 * Returns the bike object or throws an error.
 */
const validateBike = async (bikeId) => {
  try {
    const response = await axios.get(`${BIKE_SERVICE_URL}/api/bikes/${bikeId}`, {
      timeout: 5000,
    });

    const bike = response.data.data;

    if (!bike) {
      throw { status: 404, message: 'Motorcycle not found.' };
    }

    if (!bike.availability) {
      throw { status: 400, message: 'This motorcycle is currently not available for booking.' };
    }

    return bike;
  } catch (err) {
    if (err.status) throw err; // already formatted
    if (err.response && err.response.status === 404) {
      throw { status: 404, message: 'Motorcycle not found.' };
    }
    throw { status: 503, message: 'Bike service unavailable. Please try again.' };
  }
};

module.exports = { validateBike };
