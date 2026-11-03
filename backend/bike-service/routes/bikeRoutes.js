const express = require('express');
const router  = express.Router();
const { getAllBikes, getBikeById, createBike, updateBike, deleteBike, toggleAvailability } = require('../controllers/bikeController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/',                    getAllBikes);
router.get('/:id',                 getBikeById);
router.post('/',                   verifyToken, requireAdmin, createBike);
router.put('/:id',                 verifyToken, requireAdmin, updateBike);
router.delete('/:id',              verifyToken, requireAdmin, deleteBike);
router.patch('/:id/availability',  verifyToken, requireAdmin, toggleAvailability);

module.exports = router;
