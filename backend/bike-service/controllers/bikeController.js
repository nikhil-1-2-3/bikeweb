const pool = require('../config/db');

// GET /api/bikes  — supports ?brand=&minPrice=&maxPrice=&available=
const getAllBikes = async (req, res, next) => {
  try {
    const { brand, minPrice, maxPrice, available } = req.query;

    const conditions = [];
    const values     = [];
    let   idx        = 1;

    if (brand) {
      conditions.push(`LOWER(brand) = LOWER($${idx++})`);
      values.push(brand);
    }
    if (minPrice) {
      conditions.push(`price >= $${idx++}`);
      values.push(Number(minPrice));
    }
    if (maxPrice) {
      conditions.push(`price <= $${idx++}`);
      values.push(Number(maxPrice));
    }
    if (available !== undefined) {
      conditions.push(`availability = $${idx++}`);
      values.push(available === 'true');
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql   = `SELECT * FROM motorcycles ${where} ORDER BY created_at DESC`;

    const result = await pool.query(sql, values);
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/bikes/:id
const getBikeById = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM motorcycles WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Motorcycle not found.' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/bikes  (admin)
const createBike = async (req, res, next) => {
  try {
    const { name, brand, model, description, price, engine_capacity, mileage, fuel_type, transmission, image_url, availability } = req.body;

    if (!name || !brand || !model || !price) {
      return res.status(400).json({ error: true, message: 'name, brand, model and price are required.' });
    }

    const result = await pool.query(
      `INSERT INTO motorcycles
        (name, brand, model, description, price, engine_capacity, mileage, fuel_type, transmission, image_url, availability)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [name, brand, model, description || null, price, engine_capacity || null,
       mileage || null, fuel_type || 'Petrol', transmission || 'Manual',
       image_url || null, availability !== undefined ? availability : true]
    );

    return res.status(201).json({ success: true, message: 'Motorcycle created.', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/bikes/:id  (admin)
const updateBike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, brand, model, description, price, engine_capacity, mileage, fuel_type, transmission, image_url, availability } = req.body;

    const existing = await pool.query('SELECT id FROM motorcycles WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Motorcycle not found.' });
    }

    const result = await pool.query(
      `UPDATE motorcycles SET
        name=$1, brand=$2, model=$3, description=$4, price=$5,
        engine_capacity=$6, mileage=$7, fuel_type=$8, transmission=$9,
        image_url=$10, availability=$11, updated_at=CURRENT_TIMESTAMP
       WHERE id=$12 RETURNING *`,
      [name, brand, model, description || null, price,
       engine_capacity || null, mileage || null,
       fuel_type || 'Petrol', transmission || 'Manual',
       image_url || null, availability !== undefined ? availability : true, id]
    );

    return res.json({ success: true, message: 'Motorcycle updated.', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/bikes/:id  (admin)
const deleteBike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM motorcycles WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Motorcycle not found.' });
    }
    return res.json({ success: true, message: 'Motorcycle deleted.' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bikes/:id/availability  (admin)
const toggleAvailability = async (req, res, next) => {
  try {
    const { id }          = req.params;
    const { availability } = req.body;

    if (availability === undefined) {
      return res.status(400).json({ error: true, message: 'availability field required.' });
    }

    const result = await pool.query(
      `UPDATE motorcycles SET availability = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [availability, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Motorcycle not found.' });
    }

    return res.json({ success: true, message: 'Availability updated.', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllBikes, getBikeById, createBike, updateBike, deleteBike, toggleAvailability };
