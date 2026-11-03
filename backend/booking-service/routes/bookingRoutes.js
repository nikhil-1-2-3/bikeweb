const express = require('express');
const router  = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus,
} = require('../controllers/bookingController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.post('/',              verifyToken, createAppointment);
router.get('/my',             verifyToken, getMyAppointments);
router.get('/',               verifyToken, requireAdmin, getAllAppointments);
router.get('/:id',            verifyToken, getAppointmentById);
router.patch('/:id/cancel',   verifyToken, cancelAppointment);
router.patch('/:id/status',   verifyToken, requireAdmin, updateAppointmentStatus);

module.exports = router;
