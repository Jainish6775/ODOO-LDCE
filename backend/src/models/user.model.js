const db = require('../config/db');

const UserModel = {
  async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await db.query(
      'SELECT id, email, first_name, last_name, phone, city, country, bio, profile_image, preferred_currency, preferred_language, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ email, passwordHash, firstName, lastName, phone, city, country, bio, profileImage }) {
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, city, country, bio, profile_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [email, passwordHash, firstName, lastName, phone || null, city || null, country || null, bio || null, profileImage || null]
    );
    return rows[0].id;
  },

  async update(id, fields) {
    const allowedFields = ['first_name', 'last_name', 'phone', 'city', 'country', 'bio', 'profile_image', 'preferred_currency', 'preferred_language'];
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updates.length === 0) return false;

    values.push(id);
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values);
    return true;
  },

  async updatePassword(id, passwordHash) {
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, id]);
    return true;
  },

  async delete(id) {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    return true;
  },

  async getInterests(userId) {
    const { rows } = await db.query('SELECT interest FROM travel_interests WHERE user_id = $1', [userId]);
    return rows.map((r) => r.interest);
  },

  async setInterests(userId, interests) {
    await db.query('DELETE FROM travel_interests WHERE user_id = $1', [userId]);
    if (interests && interests.length > 0) {
      const values = [];
      const placeholders = interests.map((interest, i) => {
        values.push(userId, interest);
        return `($${i * 2 + 1}, $${i * 2 + 2})`;
      }).join(', ');
      await db.query(`INSERT INTO travel_interests (user_id, interest) VALUES ${placeholders}`, values);
    }
  },

  async getAll({ search, limit = 50, offset = 0 }) {
    let query = 'SELECT id, email, first_name, last_name, city, country, role, created_at FROM users';
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` WHERE first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex + 1} OR email ILIKE $${paramIndex + 2}`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
      paramIndex += 3;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const { rows } = await db.query(query, params);
    return rows;
  },

  async count() {
    const { rows } = await db.query('SELECT COUNT(*) as total FROM users');
    return parseInt(rows[0].total, 10);
  },
};

module.exports = UserModel;
