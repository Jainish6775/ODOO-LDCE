const db = require('../config/db');

const UserModel = {
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, email, first_name, last_name, phone, city, country, bio, profile_image, preferred_currency, preferred_language, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ email, passwordHash, firstName, lastName, phone, city, country, bio, profileImage }) {
    const [result] = await db.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, city, country, bio, profile_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, passwordHash, firstName, lastName, phone || null, city || null, country || null, bio || null, profileImage || null]
    );
    return result.insertId;
  },

  async update(id, fields) {
    const allowedFields = ['first_name', 'last_name', 'phone', 'city', 'country', 'bio', 'profile_image', 'preferred_currency', 'preferred_language'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return false;

    values.push(id);
    await db.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    return true;
  },

  async updatePassword(id, passwordHash) {
    await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
    return true;
  },

  async delete(id) {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return true;
  },

  async getInterests(userId) {
    const [rows] = await db.execute('SELECT interest FROM travel_interests WHERE user_id = ?', [userId]);
    return rows.map((r) => r.interest);
  },

  async setInterests(userId, interests) {
    await db.execute('DELETE FROM travel_interests WHERE user_id = ?', [userId]);
    if (interests && interests.length > 0) {
      const placeholders = interests.map(() => '(?, ?)').join(', ');
      const values = interests.flatMap((interest) => [userId, interest]);
      await db.execute(`INSERT INTO travel_interests (user_id, interest) VALUES ${placeholders}`, values);
    }
  },

  async getAll({ search, limit = 50, offset = 0 }) {
    let query = 'SELECT id, email, first_name, last_name, city, country, role, created_at FROM users';
    const params = [];

    if (search) {
      query += ' WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    return rows;
  },

  async count() {
    const [rows] = await db.execute('SELECT COUNT(*) as total FROM users');
    return rows[0].total;
  },
};

module.exports = UserModel;
