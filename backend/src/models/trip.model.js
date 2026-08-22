const db = require('../config/db');

const TripModel = {
  async create({ userId, name, description, coverImage, startDate, endDate, startingLocation, budget, travelerCount, visibility }) {
    const [result] = await db.execute(
      `INSERT INTO trips (user_id, name, description, cover_image, start_date, end_date, starting_location, budget, traveler_count, visibility)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, description || null, coverImage || null, startDate, endDate, startingLocation || null, budget || 0, travelerCount || 1, visibility || 'private']
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM trips WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findAllByUser(userId, { status, search, limit = 50, offset = 0 }) {
    let query = 'SELECT * FROM trips WHERE user_id = ?';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY start_date ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    return rows;
  },

  async update(id, fields) {
    const allowedFields = ['name', 'description', 'cover_image', 'start_date', 'end_date', 'starting_location', 'budget', 'traveler_count', 'visibility', 'status'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return false;

    values.push(id);
    await db.execute(`UPDATE trips SET ${updates.join(', ')} WHERE id = ?`, values);
    return true;
  },

  async delete(id) {
    await db.execute('DELETE FROM trips WHERE id = ?', [id]);
    return true;
  }
};

module.exports = TripModel;
