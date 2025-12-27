const { Pool } = require('pg');

// PostgreSQL connection pool for sandbox queries
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'ciphersqlstudio_sandbox',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event handlers for the pool
pool.on('connect', () => {
  console.log('New client connected to PostgreSQL pool');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Helper function to execute queries with timeout
const executeQuery = async (query, params = [], timeoutMs = 5000) => {
  const client = await pool.connect();
  
  try {
    // Set statement timeout to prevent long-running queries
    await client.query(`SET statement_timeout = ${timeoutMs}`);
    
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};

// Helper function to execute query within a specific schema
const executeInSchema = async (schemaName, query, timeoutMs = 5000) => {
  const client = await pool.connect();
  
  try {
    // Set the search path to the specific schema
    await client.query(`SET search_path TO ${schemaName}`);
    await client.query(`SET statement_timeout = ${timeoutMs}`);
    
    const result = await client.query(query);
    return result;
  } finally {
    // Reset search path and release
    await client.query('SET search_path TO public');
    client.release();
  }
};

// Create a new schema for an assignment workspace
const createSchema = async (schemaName) => {
  const client = await pool.connect();
  
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
    return true;
  } finally {
    client.release();
  }
};

// Drop a schema and all its contents
const dropSchema = async (schemaName) => {
  const client = await pool.connect();
  
  try {
    await client.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
    return true;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  connect: () => pool.connect().then(client => { client.release(); return true; }),
  end: () => pool.end(),
  query: executeQuery,
  executeInSchema,
  createSchema,
  dropSchema
};
