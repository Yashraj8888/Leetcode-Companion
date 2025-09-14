const express = require('express');
const axios = require('axios');
const router = express.Router();

const { QuestionService } = require('../services/databaseService');
const SyncService = require('../services/syncService');
const LEETCODE_API_BASE = process.env.LEETCODE_API_BASE || 'http://localhost:3000';

// Get problem details by title slug or problem number
router.get('/details/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const cacheKey = `problem_${identifier}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Sync question data from database/API
    const questionData = await SyncService.syncQuestionData(identifier);
    
    if (!questionData) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Format response to match original API structure
    const response = {
      questionId: questionData.question_id,
      questionFrontendId: questionData.question_id,
      questionTitle: questionData.title,
      titleSlug: questionData.title_slug,
      difficulty: questionData.difficulty,
      likes: questionData.likes,
      dislikes: questionData.dislikes,
      acceptanceRate: questionData.acceptance_rate,
      totalSubmissions: questionData.total_submissions,
      topicTags: questionData.topic_tags,
      content: questionData.content,
      hints: questionData.hints,
      similarQuestions: questionData.similar_questions,
      isPaidOnly: questionData.is_premium,
      // Include our new rating data
      mathematicalScore: questionData.mathematical_score,
      aiScore: questionData.ai_score,
      aiReason: questionData.ai_reason
    };

    // Cache the result
    req.cache.set(cacheKey, response);
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching problem details:', error.message);
    res.status(500).json({ error: 'Failed to fetch problem details' });
  }
});

// Get all problems with filtering options
router.get('/list', async (req, res) => {
  try {
    const { 
      limit = 50, 
      skip = 0, 
      difficulty, 
      tags,
      minRating,
      maxRating,
      sortBy = 'question_id',
      sortOrder = 'ASC'
    } = req.query;
    
    const cacheKey = `problems_${limit}_${skip}_${difficulty || 'all'}_${tags || 'none'}_${minRating || 'min'}_${maxRating || 'max'}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Get problems from database
    const filters = {
      limit: parseInt(limit),
      offset: parseInt(skip),
      difficulty: difficulty?.toUpperCase(),
      tags: tags ? tags.split(',') : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      maxRating: maxRating ? parseFloat(maxRating) : undefined,
      sortBy,
      sortOrder: sortOrder.toUpperCase()
    };

    const questions = await QuestionService.getQuestions(filters);
    
    // Format response to match original API structure
    const response = {
      problemsetQuestionList: questions.map(q => ({
        frontendQuestionId: q.question_id.toString(),
        title: q.title,
        titleSlug: q.title_slug,
        difficulty: q.difficulty,
        likes: q.likes,
        dislikes: q.dislikes,
        acRate: q.acceptance_rate.toString(),
        totalSubmissions: q.total_submissions,
        topicTags: q.topic_tags,
        isPaidOnly: q.is_premium,
        mathematicalScore: q.mathematical_score,
        aiScore: q.ai_score,
        aiReason: q.ai_reason
      })),
      total: questions.length
    };
    
    // Cache the result
    req.cache.set(cacheKey, response);
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching problems list:', error.message);
    res.status(500).json({ error: 'Failed to fetch problems list' });
  }
});

// Get daily problem
router.get('/daily', async (req, res) => {
  try {
    const cacheKey = 'daily_problem';
    
    // Check cache first (shorter TTL for daily problem)
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Sync daily problem data
    const dailyData = await SyncService.syncDailyProblem();
    
    // Cache for 1 hour
    req.cache.set(cacheKey, dailyData, 3600);
    
    res.json(dailyData);
  } catch (error) {
    console.error('Error fetching daily problem:', error.message);
    res.status(500).json({ error: 'Failed to fetch daily problem' });
  }
});

// Search problems by title or content
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const cacheKey = `search_${query}_${limit}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Search problems in database
    const questions = await QuestionService.searchQuestions(query, parseInt(limit));
    
    const result = {
      problemsetQuestionList: questions.map(q => ({
        frontendQuestionId: q.question_id.toString(),
        title: q.title,
        titleSlug: q.title_slug,
        difficulty: q.difficulty,
        likes: q.likes,
        dislikes: q.dislikes,
        acRate: q.acceptance_rate.toString(),
        totalSubmissions: q.total_submissions,
        topicTags: q.topic_tags,
        isPaidOnly: q.is_premium,
        mathematicalScore: q.mathematical_score,
        aiScore: q.ai_score,
        aiReason: q.ai_reason
      })),
      total: questions.length
    };
    
    // Cache the result
    req.cache.set(cacheKey, result);
    
    res.json(result);
  } catch (error) {
    console.error('Error searching problems:', error.message);
    res.status(500).json({ error: 'Failed to search problems' });
  }
});

module.exports = router;
