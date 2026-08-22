const db = require('../config/db');

const TripModel = {
  async create({ userId, name, description, coverImage, startDate, endDate, startingLocation, budget, travelerCount, visibility }) {
    const { rows } = await db.query(
      `INSERT INTO trips (user_id, name, description, cover_image, start_date, end_date, starting_location, budget, traveler_count, visibility)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [userId, name, description || null, coverImage || null, startDate, endDate, startingLocation || null, budget || 0, travelerCount || 1, visibility || 'private']
    );
    return rows[0].id;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM trips WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async findAllByUser(userId, { status, search, limit = 50, offset = 0 }) {
    let query = 'SELECT * FROM trips WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY start_date ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
  },

  async update(id, fields) {
    const allowedFields = ['name', 'description', 'cover_image', 'start_date', 'end_date', 'starting_location', 'budget', 'traveler_count', 'visibility', 'status'];
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updates.length === 0) return false;

    values.push(id);
    await db.query(`UPDATE trips SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values);
    return true;
  },

  async delete(id) {
    await db.query('DELETE FROM trips WHERE id = $1', [id]);
    return true;
  }
};

module.exports = TripModel;
