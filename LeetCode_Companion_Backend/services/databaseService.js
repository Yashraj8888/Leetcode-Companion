const { pool } = require('../config/database');
const { calculateQuestionRating } = require('./ratingService');

/**
 * User-related database operations
 */
class UserService {
  static async getUserByUsername(username) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async createOrUpdateUser(username, userData) {
    const client = await pool.connect();
    try {
      const {
        profileData = {},
        solvedProblems = {},
        contestData = {},
        languageStats = {},
        skillStats = {}
      } = userData;

      const result = await client.query(`
        INSERT INTO users (username, profile_data, solved_problems, contest_data, language_stats, skill_stats, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (username) 
        DO UPDATE SET 
          profile_data = $2,
          solved_problems = $3,
          contest_data = $4,
          language_stats = $5,
          skill_stats = $6,
          last_updated = CURRENT_TIMESTAMP
        RETURNING *
      `, [username, profileData, solvedProblems, contestData, languageStats, skillStats]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async isUserDataStale(username, maxAgeHours = 24) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT last_updated FROM users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) return true;

      const lastUpdated = new Date(result.rows[0].last_updated);
      const now = new Date();
      const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);

      return hoursDiff > maxAgeHours;
    } finally {
      client.release();
    }
  }
}

/**
 * Question-related database operations
 */
class QuestionService {
  static async getQuestionById(questionId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM questions WHERE question_id = $1',
        [questionId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async getQuestionBySlug(titleSlug) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM questions WHERE title_slug = $1',
        [titleSlug]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async createOrUpdateQuestion(questionData) {
    const client = await pool.connect();
    try {
      const {
        questionId,
        titleSlug,
        title,
        difficulty,
        likes = 0,
        dislikes = 0,
        acceptanceRate = 0,
        totalSubmissions = 0,
        tags = [],
        topicTags = [],
        content = '',
        hints = [],
        similarQuestions = [],
        isPremium = false
      } = questionData;

      // Calculate ratings
      const maxQuestionId = await this.getMaxQuestionId();
      const ratingData = await calculateQuestionRating({
        likes,
        dislikes,
        acceptanceRate,
        questionNumber: questionId,
        maxQuestionId,
        difficulty,
        tags: topicTags.map(tag => tag.name || tag),
        title,
        content
      });

      const result = await client.query(`
        INSERT INTO questions (
          question_id, title_slug, title, difficulty, likes, dislikes, 
          acceptance_rate, total_submissions, tags, topic_tags, content, 
          hints, similar_questions, is_premium, mathematical_score, 
          ai_score, ai_reason, last_updated
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP)
        ON CONFLICT (question_id) 
        DO UPDATE SET 
          title_slug = $2,
          title = $3,
          difficulty = $4,
          likes = $5,
          dislikes = $6,
          acceptance_rate = $7,
          total_submissions = $8,
          tags = $9,
          topic_tags = $10,
          content = $11,
          hints = $12,
          similar_questions = $13,
          is_premium = $14,
          mathematical_score = $15,
          ai_score = $16,
          ai_reason = $17,
          last_updated = CURRENT_TIMESTAMP
        RETURNING *
      `, [
        questionId, titleSlug, title, difficulty, likes, dislikes,
        acceptanceRate, totalSubmissions, JSON.stringify(tags), 
        JSON.stringify(topicTags), content, JSON.stringify(hints),
        JSON.stringify(similarQuestions), isPremium,
        ratingData.mathematicalScore, ratingData.aiScore, ratingData.aiReason
      ]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getQuestions(filters = {}) {
    const client = await pool.connect();
    try {
      const {
        limit = 50,
        offset = 0,
        difficulty,
        tags,
        minRating,
        maxRating,
        sortBy = 'question_id',
        sortOrder = 'ASC'
      } = filters;

      let query = 'SELECT * FROM questions WHERE 1=1';
      const params = [];
      let paramCount = 0;

      if (difficulty) {
        paramCount++;
        query += ` AND difficulty = $${paramCount}`;
        params.push(difficulty);
      }

      if (tags && tags.length > 0) {
        paramCount++;
        query += ` AND topic_tags::text ILIKE $${paramCount}`;
        params.push(`%${tags}%`);
      }

      if (minRating) {
        paramCount++;
        query += ` AND mathematical_score >= $${paramCount}`;
        params.push(minRating);
      }

      if (maxRating) {
        paramCount++;
        query += ` AND mathematical_score <= $${paramCount}`;
        params.push(maxRating);
      }

      query += ` ORDER BY ${sortBy} ${sortOrder}`;
      
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(limit);

      paramCount++;
      query += ` OFFSET $${paramCount}`;
      params.push(offset);

      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async searchQuestions(searchQuery, limit = 20) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM questions 
        WHERE title ILIKE $1 OR title_slug ILIKE $1
        ORDER BY mathematical_score DESC, question_id ASC
        LIMIT $2
      `, [`%${searchQuery}%`, limit]);

      return result.rows;
    } finally {
      client.release();
    }
  }

  static async isQuestionDataStale(questionId, maxAgeHours = 168) { // 7 days default
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT last_updated FROM questions WHERE question_id = $1',
        [questionId]
      );

      if (result.rows.length === 0) return true;

      const lastUpdated = new Date(result.rows[0].last_updated);
      const now = new Date();
      const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);

      return hoursDiff > maxAgeHours;
    } finally {
      client.release();
    }
  }

  static async getMaxQuestionId() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT MAX(question_id) as max_id FROM questions');
      return result.rows[0]?.max_id || 3000; // Default fallback
    } finally {
      client.release();
    }
  }

  static async getQuestionStats() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          COUNT(*) as total_questions,
          COUNT(CASE WHEN difficulty = 'Easy' THEN 1 END) as easy_count,
          COUNT(CASE WHEN difficulty = 'Medium' THEN 1 END) as medium_count,
          COUNT(CASE WHEN difficulty = 'Hard' THEN 1 END) as hard_count,
          AVG(mathematical_score) as avg_math_score,
          AVG(ai_score) as avg_ai_score
        FROM questions
      `);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getSimilarQuestions(questionId, limit = 5) {
    const client = await pool.connect();
    try {
      // Get the current question's tags
      const currentQuestion = await client.query(
        'SELECT topic_tags, difficulty FROM questions WHERE question_id = $1',
        [questionId]
      );

      if (currentQuestion.rows.length === 0) return [];

      const topicTags = currentQuestion.rows[0].topic_tags || [];
      const difficulty = currentQuestion.rows[0].difficulty;

      if (topicTags.length === 0) return [];

      // Find similar questions based on shared tags
      const tagNames = topicTags.map(tag => tag.name || tag);
      const tagQuery = tagNames.map(tag => `topic_tags::text ILIKE '%${tag}%'`).join(' OR ');

      const result = await client.query(`
        SELECT *, 
          (CASE WHEN difficulty = $2 THEN 2 ELSE 1 END) as difficulty_bonus
        FROM questions 
        WHERE question_id != $1 
          AND (${tagQuery})
        ORDER BY difficulty_bonus DESC, mathematical_score DESC
        LIMIT $3
      `, [questionId, difficulty, limit]);

      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = {
  UserService,
  QuestionService
};
