const db = require('../config/db');

const destinationsController = {
  async getDestinations(req, res, next) {
    try {
      const { search, country, region, cost_level, sort_by } = req.query;
      
      let query = 'SELECT * FROM destinations WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR country ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (country) {
        query += ` AND country ILIKE $${paramIndex}`;
        params.push(`%${country}%`);
        paramIndex++;
      }

      if (region) {
        query += ` AND region ILIKE $${paramIndex}`;
        params.push(`%${region}%`);
        paramIndex++;
      }

      if (cost_level) {
        query += ` AND cost_level = $${paramIndex}`;
        params.push(cost_level);
        paramIndex++;
      }

      if (sort_by === 'popularity') {
        query += ' ORDER BY popularity_score DESC';
      } else if (sort_by === 'cost') {
        query += ' ORDER BY cost_level ASC'; // budget, moderate, luxury ordering relies on enum internal order or mapping if string
      } else if (sort_by === 'name') {
        query += ' ORDER BY name ASC';
      } else {
        query += ' ORDER BY popularity_score DESC'; // Default sort
      }

      const { rows } = await db.query(query, params);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },

  async getDestinationById(req, res, next) {
    try {
      const { id } = req.params;
      const { rows } = await db.query('SELECT * FROM destinations WHERE id = $1', [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Destination not found' });
      }
      
      res.json(rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async getActivitiesForDestination(req, res, next) {
    try {
      const { id } = req.params;
      
      // Check if destination exists
      const destCheck = await db.query('SELECT id FROM destinations WHERE id = $1', [id]);
      if (destCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Destination not found' });
      }

      const { rows } = await db.query('SELECT * FROM activities WHERE destination_id = $1 ORDER BY rating DESC', [id]);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = destinationsController;
