import pg from 'pg';
import Redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
export const postgresPool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'djfly',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Redis client
export const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
});

// Test database connection
export const testConnection = async () => {
  try {
    const client = await postgresPool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ PostgreSQL connected:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    return false;
  }
};

// Connect to Redis
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    return false;
  }
};

// Main database connection function
export const connectDB = async () => {
  try {
    // Test PostgreSQL connection
    const pgConnected = await testConnection();
    if (!pgConnected) {
      throw new Error('PostgreSQL connection failed');
    }

    // Connect to Redis
    const redisConnected = await connectRedis();
    if (!redisConnected) {
      console.warn('⚠️ Redis connection failed, continuing without caching');
    }

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

// Graceful shutdown
export const closeConnections = async () => {
  try {
    await postgresPool.end();
    await redisClient.quit();
    console.log('✅ Database connections closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database connections:', error.message);
  }
};

// Handle process termination
process.on('SIGINT', closeConnections);
process.on('SIGTERM', closeConnections);
