const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'leetcode_companion',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Initialize database tables
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        profile_data JSONB,
        solved_problems JSONB,
        contest_data JSONB,
        language_stats JSONB,
        skill_stats JSONB,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create questions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question_id INTEGER UNIQUE NOT NULL,
        title_slug VARCHAR(200) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        difficulty VARCHAR(20) NOT NULL,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        acceptance_rate DECIMAL(5,2) DEFAULT 0,
        total_submissions INTEGER DEFAULT 0,
        tags JSONB,
        topic_tags JSONB,
        content TEXT,
        hints JSONB,
        similar_questions JSONB,
        is_premium BOOLEAN DEFAULT FALSE,
        mathematical_score DECIMAL(3,1),
        ai_score DECIMAL(3,1),
        ai_reason TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_last_updated ON users(last_updated);
      CREATE INDEX IF NOT EXISTS idx_questions_question_id ON questions(question_id);
      CREATE INDEX IF NOT EXISTS idx_questions_title_slug ON questions(title_slug);
      CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
      CREATE INDEX IF NOT EXISTS idx_questions_last_updated ON questions(last_updated);
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  initializeDatabase
};
