const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../src/config/env');

async function run() {
  let connection;
  try {
    // Connect without database first to create it
    connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      multipleStatements: true,
    });

    console.log('Connected to MySQL server.');

    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const seedPath = path.join(__dirname, '../database/seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Running schema.sql...');
    await connection.query(schemaSql);
    console.log('Schema created successfully.');

    console.log('Running seed.sql...');
    await connection.query(seedSql);
    console.log('Seed data inserted successfully.');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

run();
