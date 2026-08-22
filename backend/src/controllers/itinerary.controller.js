const db = require('../config/db');
const tripStopController = require('./trip_stop.controller');

const itineraryController = {
  // Activities
  async getActivitiesForStop(req, res, next) {
    try {
      const { stopId } = req.params;
      const { rows } = await db.query('SELECT * FROM scheduled_activities WHERE trip_stop_id = $1 ORDER BY day_number ASC, scheduled_time ASC', [stopId]);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },

  async addActivity(req, res, next) {
    try {
      const { stopId } = req.params;
      const { activity_id, custom_name, day_number, scheduled_time, duration_hours, estimated_cost, notes } = req.body;
      
      const { rows } = await db.query(
        `INSERT INTO scheduled_activities (trip_stop_id, activity_id, custom_name, day_number, scheduled_time, duration_hours, estimated_cost, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [stopId, activity_id, custom_name, day_number, scheduled_time, duration_hours, estimated_cost, notes]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async deleteActivity(req, res, next) {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM scheduled_activities WHERE id = $1', [id]);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Accommodations
  async addAccommodation(req, res, next) {
    try {
      const { stopId } = req.params;
      const { name, type, check_in_date, check_out_date, cost, notes } = req.body;
      
      const { rows } = await db.query(
        `INSERT INTO accommodations (trip_stop_id, name, type, check_in_date, check_out_date, cost, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [stopId, name, type, check_in_date, check_out_date, cost, notes]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async deleteAccommodation(req, res, next) {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM accommodations WHERE id = $1', [id]);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Transports
  async addTransport(req, res, next) {
    try {
      const { stopId } = req.params;
      const { mode, from_location, to_location, departure_time, arrival_time, cost, notes } = req.body;
      
      const { rows } = await db.query(
        `INSERT INTO transports (trip_stop_id, mode, from_location, to_location, departure_time, arrival_time, cost, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [stopId, mode, from_location, to_location, departure_time, arrival_time, cost, notes]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async deleteTransport(req, res, next) {
    try {
      const { id } = req.params;
      await db.query('DELETE FROM transports WHERE id = $1', [id]);
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = itineraryController;
