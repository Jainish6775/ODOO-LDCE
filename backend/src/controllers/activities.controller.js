const db = require('../config/db');

const activitiesController = {
  async searchActivities(req, res, next) {
    try {
      const { search, destination_id, category, min_cost, max_cost, sort_by } = req.query;
      
      let query = 'SELECT * FROM activities WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      if (search) {
        query += ` AND name ILIKE $${paramIndex}`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (destination_id) {
        query += ` AND destination_id = $${paramIndex}`;
        params.push(destination_id);
        paramIndex++;
      }

      if (category) {
        query += ` AND category ILIKE $${paramIndex}`;
        params.push(`%${category}%`);
        paramIndex++;
      }
      
      if (min_cost) {
        query += ` AND estimated_cost >= $${paramIndex}`;
        params.push(min_cost);
        paramIndex++;
      }
      
      if (max_cost) {
        query += ` AND estimated_cost <= $${paramIndex}`;
        params.push(max_cost);
        paramIndex++;
      }

      if (sort_by === 'cost_asc') {
        query += ' ORDER BY estimated_cost ASC';
      } else if (sort_by === 'cost_desc') {
        query += ' ORDER BY estimated_cost DESC';
      } else if (sort_by === 'rating') {
        query += ' ORDER BY rating DESC';
      } else if (sort_by === 'duration') {
        query += ' ORDER BY duration_hours ASC';
      } else {
        query += ' ORDER BY rating DESC'; // Default sort
      }

      const { rows } = await db.query(query, params);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },

  async getActivityById(req, res, next) {
    try {
      const { id } = req.params;
      const { rows } = await db.query('SELECT * FROM activities WHERE id = $1', [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      
      res.json(rows[0]);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = activitiesController;
