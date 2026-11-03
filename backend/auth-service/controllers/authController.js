const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../config/db');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: true, message: 'full_name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: true, message: 'Password must be at least 6 characters.' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: true, message: 'Email already registered.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING id, full_name, email, phone, role, created_at`,
      [full_name.trim(), email.toLowerCase().trim(), phone || null, password_hash]
    );

    const user  = result.rows[0];
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required.' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: true, message: 'Invalid email or password.' });
    }

    const user  = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: true, message: 'Invalid email or password.' });
    }

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { user: safeUser, token },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/profile
const getProfile = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone } = req.body;

    if (!full_name) {
      return res.status(400).json({ error: true, message: 'full_name is required.' });
    }

    const result = await pool.query(
      `UPDATE users SET full_name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, full_name, email, phone, role, updated_at`,
      [full_name.trim(), phone || null, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated.',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/users  (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/users/:id  (admin only)
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/verify  (internal — used by other services via gateway header)
const verifyUser = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(400).json({ error: true, message: 'x-user-id header required.' });

    const result = await pool.query(
      'SELECT id, full_name, email, phone, role FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, updateProfile, getAllUsers, getUserById, verifyUser };
