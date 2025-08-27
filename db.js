const { Pool } = require('pg');
require('dotenv').config();

// Parse the database port as integer
const dbPort = parseInt(process.env.DB_PORT) || 5432;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: dbPort,
  // Add these options for better connection handling
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

// Test connection function
async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log('✓ Connected to PostgreSQL database');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✓ Current database time:', result.rows[0].current_time);
    
    // Check if our tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    const tablesResult = await client.query(tablesQuery);
    console.log('✓ Tables in database:', tablesResult.rows.map(row => row.table_name));
    
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:');
    console.error('Error details:', err.message);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = { pool, testConnection };