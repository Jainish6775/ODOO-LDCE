const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const config = require('../src/config/env');

async function run() {
  const client = new Client({
    connectionString: config.databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL (Neon) server.');

    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const seedPath = path.join(__dirname, '../database/seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Running schema.sql...');
    await client.query(schemaSql);
    console.log('Schema created successfully.');

    console.log('Running seed.sql...');
    await client.query(seedSql);
    console.log('Seed data inserted successfully.');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

run();
