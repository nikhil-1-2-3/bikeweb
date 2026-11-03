const express = require('express');
const router  = express.Router();
const { register, login, getProfile, updateProfile, getAllUsers, getUserById, verifyUser } = require('../controllers/authController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.post('/register',  register);
router.post('/login',     login);
router.get('/profile',    verifyToken, getProfile);
router.put('/profile',    verifyToken, updateProfile);
router.get('/users',      verifyToken, requireAdmin, getAllUsers);
router.get('/users/:id',  verifyToken, requireAdmin, getUserById);
router.get('/verify',     verifyUser); // internal service-to-service

module.exports = router;
