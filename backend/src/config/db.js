const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection on startup & auto-create required auxiliary tables
pool.query('SELECT NOW()')
  .then(async () => {
    console.log('✅ PostgreSQL (Neon) connected successfully');
    
    // Auto-create likes table if missing
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS likes (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          trip_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, trip_id)
        );
      `);
      console.log('✅ Auxiliary table "likes" verified/created.');
    } catch (e) {
      console.warn('⚠️ Likes table verification warning:', e.message);
    }

    // Auto-create saved_destinations table if missing
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS saved_destinations (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          destination_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, destination_id)
        );
      `);
      console.log('✅ Auxiliary table "saved_destinations" verified/created.');
    } catch (e) {
      console.warn('⚠️ Saved destinations table verification warning:', e.message);
    }

  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed:', err.message);
  });

module.exports = pool;
