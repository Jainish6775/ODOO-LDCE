const db = require('../config/db');

const TripStopModel = {
  async create({ tripId, destinationId, arrivalDate, departureDate, sequenceOrder, notes }) {
    const { rows } = await db.query(
      `INSERT INTO trip_stops (trip_id, destination_id, arrival_date, departure_date, sequence_order, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [tripId, destinationId || null, arrivalDate, departureDate, sequenceOrder || 1, notes || null]
    );
    return rows[0].id;
  },

  async findAllByTrip(tripId) {
    const { rows } = await db.query(
      `SELECT ts.*, d.name as destination_name, d.image_url as destination_image, d.country
       FROM trip_stops ts
       LEFT JOIN destinations d ON ts.destination_id = d.id
       WHERE ts.trip_id = $1
       ORDER BY ts.sequence_order ASC`,
      [tripId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM trip_stops WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async update(id, fields) {
    const allowedFields = ['destination_id', 'arrival_date', 'departure_date', 'sequence_order', 'notes'];
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
    await db.query(`UPDATE trip_stops SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values);
    return true;
  },

  async delete(id) {
    await db.query('DELETE FROM trip_stops WHERE id = $1', [id]);
    return true;
  }
};

module.exports = TripStopModel;
