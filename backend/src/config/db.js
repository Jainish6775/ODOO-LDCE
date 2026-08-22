const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ PostgreSQL (Neon) connected successfully');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed:', err.message);
  });

module.exports = pool;
