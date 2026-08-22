const db = require('../config/db');

const TripStopModel = {
  async create({ tripId, destinationId, arrivalDate, departureDate, sequenceOrder, notes }) {
    const [result] = await db.execute(
      `INSERT INTO trip_stops (trip_id, destination_id, arrival_date, departure_date, sequence_order, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tripId, destinationId || null, arrivalDate, departureDate, sequenceOrder || 1, notes || null]
    );
    return result.insertId;
  },

  async findAllByTrip(tripId) {
    const [rows] = await db.execute(
      `SELECT ts.*, d.name as destination_name, d.image_url as destination_image, d.country
       FROM trip_stops ts
       LEFT JOIN destinations d ON ts.destination_id = d.id
       WHERE ts.trip_id = ?
       ORDER BY ts.sequence_order ASC`,
      [tripId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM trip_stops WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async update(id, fields) {
    const allowedFields = ['destination_id', 'arrival_date', 'departure_date', 'sequence_order', 'notes'];
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
    await db.execute(`UPDATE trip_stops SET ${updates.join(', ')} WHERE id = ?`, values);
    return true;
  },

  async delete(id) {
    await db.execute('DELETE FROM trip_stops WHERE id = ?', [id]);
    return true;
  }
};

module.exports = TripStopModel;
