import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pkg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pkg;

// Get the directory where this config file is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the backend directory (parent of config)
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Validate environment variables
if (!process.env.DB_PASSWORD) {
  console.error('❌ DB_PASSWORD is not set');
  process.exit(1);
}

if (typeof process.env.DB_PASSWORD !== 'string') {
  console.error('❌ DB_PASSWORD is not a string. Type:', typeof process.env.DB_PASSWORD);
  process.exit(1);
}

// For raw SQL queries
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  // Add connection timeout and retry settings
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL database');
  });
});

// For Sequelize ORM
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default { sequelize, pool, testConnection }; 