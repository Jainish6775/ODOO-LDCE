const db = require('../config/db');

const communityController = {
  async getPublicTrips(req, res, next) {
    try {
      const { search } = req.query;
      
      let query = `
        SELECT t.*, u.username as creator_name,
        (SELECT COUNT(*) FROM likes WHERE trip_id = t.id) as likes_count
        FROM trips t
        JOIN users u ON t.user_id = u.id
        WHERE t.visibility = 'public'
      `;
      let params = [];

      if (search) {
        query += ` AND t.name ILIKE $1`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY t.created_at DESC LIMIT 50`;

      const { rows } = await db.query(query, params);
      res.json(rows);
    } catch (error) {
      next(error);
    }
  },

  async likeTrip(req, res, next) {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      // Check if already liked
      const checkRes = await db.query('SELECT * FROM likes WHERE user_id = $1 AND trip_id = $2', [userId, tripId]);
      
      if (checkRes.rows.length > 0) {
        // Unlike
        await db.query('DELETE FROM likes WHERE user_id = $1 AND trip_id = $2', [userId, tripId]);
        res.json({ message: 'Unliked', liked: false });
      } else {
        // Like
        await db.query('INSERT INTO likes (user_id, trip_id) VALUES ($1, $2)', [userId, tripId]);
        res.json({ message: 'Liked', liked: true });
      }
    } catch (error) {
      next(error);
    }
  },

  async copyTrip(req, res, next) {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      // Simplistic copy: Just duplicate the trip record for MVP.
      const tripRes = await db.query('SELECT * FROM trips WHERE id = $1 AND visibility = $2', [tripId, 'public']);
      if (tripRes.rows.length === 0) return res.status(404).json({ error: 'Public trip not found' });
      
      const tripToCopy = tripRes.rows[0];

      const { rows } = await db.query(
        `INSERT INTO trips (user_id, name, starting_location, duration_days, budget, cover_image, status, visibility) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [userId, `Copy of ${tripToCopy.name}`, tripToCopy.starting_location, tripToCopy.duration_days, tripToCopy.budget, tripToCopy.cover_image, 'draft', 'private']
      );

      res.status(201).json(rows[0]);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = communityController;
