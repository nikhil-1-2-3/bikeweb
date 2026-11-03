const errorHandler = (err, req, res, next) => {
  console.error('[Auth Service Error]', err.message);

  if (err.code === '23505') {
    // PostgreSQL unique violation
    return res.status(409).json({ error: true, message: 'Email already registered.' });
  }

  const status  = err.status  || 500;
  const message = err.message || 'Internal server error.';
  res.status(status).json({ error: true, message });
};

module.exports = errorHandler;
