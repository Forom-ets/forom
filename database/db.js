import { Pool } from 'pg';

// Si variables non setup, alors on utilise les valeurs par défaut
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'test',
  password: process.env.PGPASSWORD || 'test',
  database: process.env.PGDATABASE || 'DEV_DB',
});

async function runQuery(queryText, params = []) {
  return pool.query(queryText, params);
}

async function pingDatabase() {
  await pool.query('SELECT 1');
}

export { runQuery, pingDatabase };
