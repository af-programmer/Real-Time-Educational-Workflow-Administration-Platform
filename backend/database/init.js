const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DB_NAME = process.env.DB_NAME || 'eduflow';

async function initDatabase() {
  // Step 1: Connect without database
  const rootConn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  console.log('✅ Connected to MySQL.');

  // Drop and recreate for a clean slate
  await rootConn.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
  await rootConn.query(`CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  console.log(`✅ Database '${DB_NAME}' created fresh.`);
  await rootConn.end();

  // Step 2: Connect to the new database
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true,
  });

  // Step 3: Run schema (strip CREATE DATABASE / USE statements)
  console.log('Running schema...');
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    .replace(/^CREATE\s+DATABASE\b.*?;\n?/gim, '')
    .replace(/^USE\s+\S+\s*;\n?/gim, '');

  await conn.query(schema);
  console.log('✅ Schema applied.');

  // Step 4: Run seed
  console.log('Running seed data...');
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
    .replace(/^USE\s+\S+\s*;\n?/gim, '');

  await conn.query(seed);
  console.log('✅ Seed data applied.');

  await conn.end();

  console.log('\n🎉 Database ready! Demo accounts:');
  console.log('   admin@eduflow.com      | Password123!');
  console.log('   secretary@eduflow.com  | Password123!');
  console.log('   teacher1@eduflow.com   | Password123!');
  console.log('\nRun: npm run dev\n');
}

initDatabase().catch((err) => {
  console.error('❌ Initialization failed:', err.message);
  if (process.env.NODE_ENV !== 'production') console.error(err.stack);
  process.exit(1);
});
