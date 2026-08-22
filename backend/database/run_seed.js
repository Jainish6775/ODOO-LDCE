const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function runSeed() {
  try {
    console.log('Connecting to database...');
    
    // Read schema and seed files
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    
    console.log('Applying schema...');
    await pool.query(schemaSql);
    console.log('✅ Schema applied successfully.');
    
    console.log('Applying seed data...');
    await pool.query(seedSql);
    console.log('✅ Seed data applied successfully.');
    
  } catch (error) {
    console.error('❌ Error applying schema/seed:', error);
  } finally {
    pool.end();
  }
}

runSeed();
