const pool              = require('../config/db');
const { validateBike }  = require('../services/bikeValidator');

// POST /api/appointments
const createAppointment = async (req, res, next) => {
  try {
    const { bike_id, appointment_type, appointment_date, appointment_time, customer_name, customer_phone, notes } = req.body;
    const customer_id = req.user.id;

    // Basic validation
    if (!bike_id || !appointment_type || !appointment_date || !appointment_time || !customer_name || !customer_phone) {
      return res.status(400).json({
        error: true,
        message: 'bike_id, appointment_type, appointment_date, appointment_time, customer_name and customer_phone are required.',
      });
    }

    const validTypes = ['showroom_visit', 'test_ride'];
    if (!validTypes.includes(appointment_type)) {
      return res.status(400).json({ error: true, message: 'appointment_type must be showroom_visit or test_ride.' });
    }

    // Validate date is not in the past
    const apptDate = new Date(appointment_date);
    const today    = new Date(); today.setHours(0, 0, 0, 0);
    if (apptDate < today) {
      return res.status(400).json({ error: true, message: 'Appointment date cannot be in the past.' });
    }

    // Verify bike exists and is available (cross-service call)
    await validateBike(bike_id);

    // Check for overlapping booking at same date+time+bike
    const overlap = await pool.query(
      `SELECT id FROM appointments
       WHERE bike_id = $1 AND appointment_date = $2 AND appointment_time = $3
         AND status NOT IN ('cancelled', 'rejected')`,
      [bike_id, appointment_date, appointment_time]
    );

    if (overlap.rows.length > 0) {
      return res.status(409).json({
        error: true,
        message: 'This time slot is already booked for that motorcycle. Please choose a different time.',
      });
    }

    const result = await pool.query(
      `INSERT INTO appointments
         (customer_id, bike_id, appointment_type, appointment_date, appointment_time, customer_name, customer_phone, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [customer_id, bike_id, appointment_type, appointment_date, appointment_time, customer_name, customer_phone, notes || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: true, message: err.message });
    }
    next(err);
  }
};

// GET /api/appointments/my
const getMyAppointments = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE customer_id = $1 ORDER BY appointment_date DESC, appointment_time DESC`,
      [req.user.id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments  (admin)
const getAllAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const conditions = [];
    const values     = [];
    let   idx        = 1;

    if (status) {
      conditions.push(`status = $${idx++}`);
      values.push(status);
    }
    if (date) {
      conditions.push(`appointment_date = $${idx++}`);
      values.push(date);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT * FROM appointments ${where} ORDER BY appointment_date DESC, appointment_time DESC`,
      values
    );

    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/:id
const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Appointment not found.' });
    }

    const appt = result.rows[0];
    // Only owner or admin can view
    if (req.user.role !== 'admin' && appt.customer_id !== req.user.id) {
      return res.status(403).json({ error: true, message: 'Access denied.' });
    }

    return res.json({ success: true, data: appt });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/appointments/:id/cancel  (customer)
const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Appointment not found.' });
    }

    const appt = result.rows[0];

    if (appt.customer_id !== req.user.id) {
      return res.status(403).json({ error: true, message: 'You can only cancel your own appointments.' });
    }

    if (!['pending', 'confirmed'].includes(appt.status)) {
      return res.status(400).json({ error: true, message: `Cannot cancel an appointment with status: ${appt.status}.` });
    }

    const updated = await pool.query(
      `UPDATE appointments SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );

    return res.json({ success: true, message: 'Appointment cancelled.', data: updated.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/appointments/:id/status  (admin)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'rejected', 'completed', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: true, message: `status must be one of: ${validStatuses.join(', ')}.` });
    }

    const result = await pool.query('SELECT id FROM appointments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Appointment not found.' });
    }

    const updated = await pool.query(
      `UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );

    return res.json({ success: true, message: 'Appointment status updated.', data: updated.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus,
};
