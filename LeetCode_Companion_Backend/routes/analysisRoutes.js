const express = require('express');
const axios = require('axios');
const router = express.Router();

const { QuestionService, UserService } = require('../services/databaseService');
const SyncService = require('../services/syncService');
const { calculateMathematicalScore } = require('../services/ratingService');
const LEETCODE_API_BASE = process.env.LEETCODE_API_BASE || 'http://localhost:3000';

// Middleware to check for refresh requests and apply stricter rate limiting
const checkRefreshLimiter = (req, res, next) => {
  if (req.body.forceRefresh) {
    // Apply refresh rate limiter
    const rateLimit = require('express-rate-limit');
    const refreshLimiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 5, // limit each IP to 5 refresh requests per 10 minutes
      message: {
        error: 'Too many refresh requests. Please wait before forcing more refreshes.',
        retryAfter: Math.ceil(10 * 60 * 1000 / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    return refreshLimiter(req, res, next);
  }
  next();
};

// Analyze problem and provide recommendation
router.post('/analyze', checkRefreshLimiter, async (req, res) => {
  try {
    const { problemId, username, forceRefresh = false } = req.body;
    
    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required' });
    }

    let actualProblemId = problemId;
    
    // Handle problem number conversion
    if (problemId.startsWith('problem-')) {
      const problemNumber = problemId.replace('problem-', '');
      
      try {
        // Try to get problem by frontend ID (number)
        const problemsResponse = await SyncService.getFreshDataFromAPI('/problems?limit=3000');
        if (problemsResponse && problemsResponse.problemsetQuestionList) {
          const problem = problemsResponse.problemsetQuestionList.find(
            p => p.frontendQuestionId === problemNumber
          );
          
          if (problem) {
            actualProblemId = problem.titleSlug;
          } else {
            return res.status(404).json({ error: `Problem #${problemNumber} not found` });
          }
        }
      } catch (error) {
        console.error('Error fetching problems for number conversion:', error);
        return res.status(500).json({ error: 'Failed to convert problem number to slug' });
      }
    }

    const cacheKey = `analysis_${actualProblemId}_${username || 'anonymous'}`;
    
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = req.cache.get(cacheKey);
      if (cached) {
        return res.json(cached);
      }
    }

    // Sync question data from database/API (force refresh if requested)
    const questionData = await SyncService.syncQuestionData(actualProblemId, forceRefresh);
    
    if (!questionData) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Calculate recommendation based on mathematical score
    const mathScore = questionData.mathematical_score || 3.0;
    let recommendation;
    if (mathScore >= 3.5) {
      recommendation = 'do';
    } else if (mathScore >= 2.5) {
      recommendation = 'ok';
    } else {
      recommendation = 'pass';
    }

    // Extract topics and tags
    const topics = questionData.topic_tags || [];
    const difficulty = questionData.difficulty;

    // Calculate estimated solving time based on difficulty and acceptance rate
    const acceptanceRate = questionData.acceptance_rate / 100;
    let estimatedTime;
    
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        estimatedTime = Math.round(15 + (1 - acceptanceRate) * 20); // 15-35 minutes
        break;
      case 'medium':
        estimatedTime = Math.round(30 + (1 - acceptanceRate) * 45); // 30-75 minutes
        break;
      case 'hard':
        estimatedTime = Math.round(60 + (1 - acceptanceRate) * 90); // 60-150 minutes
        break;
      default:
        estimatedTime = 45;
    }

    // Check if user has solved similar problems (if username provided)
    let hasSolvedSimilar = false;
    let solvedSimilarCount = 0;
    let userTopics = [];
    let userSkillsData = [];

    if (username) {
      try {
        // Get user's skills data from skillStats API
        const skillStatsData = await SyncService.getFreshDataFromAPI(`/skillStats/${username}`);
        if (skillStatsData && skillStatsData.data && skillStatsData.data.matchedUser) {
          const tagProblemCounts = skillStatsData.data.matchedUser.tagProblemCounts;
          
          // Combine all skill levels
          const fundamental = tagProblemCounts.fundamental || [];
          const intermediate = tagProblemCounts.intermediate || [];
          const advanced = tagProblemCounts.advanced || [];
          
          userSkillsData = [
            ...fundamental.map(skill => ({ ...skill, level: 'fundamental' })),
            ...intermediate.map(skill => ({ ...skill, level: 'intermediate' })),
            ...advanced.map(skill => ({ ...skill, level: 'advanced' }))
          ];
          
          // Extract topic names from user's skills
          userTopics = userSkillsData.map(skill => skill.tagName);
        }

        // Check if current problem topics overlap with user's solved topics
        const currentTopics = topics.map(tag => tag.name || tag);
        const commonTopics = currentTopics.filter(topic => userTopics.includes(topic));
        
        if (commonTopics.length > 0) {
          hasSolvedSimilar = true;
          solvedSimilarCount = commonTopics.length;
        }
      } catch (error) {
        console.error('Error checking user skills:', error.message);
      }
    }

    // Prepare learning outcomes based on topics
    const learningOutcomes = topics.map(topic => ({
      name: topic.name || topic,
      description: getTopicDescription(topic.name || topic)
    }));

    // Calculate popularity score using the rating service
    const popularityScore = calculateMathematicalScore({
      likes: questionData.likes,
      dislikes: questionData.dislikes,
      acceptanceRate: questionData.acceptance_rate,
      questionNumber: questionData.question_id,
      maxQuestionId: 3000, // This should be set to the current maximum question ID
      difficulty: questionData.difficulty,
      tags: (questionData.topic_tags || []).map(tag => tag.name || tag)
    });

    // Additional insights
    const insights = {
      popularityScore: Math.round(popularityScore * 20), // Convert 0-5 scale to 0-100
      difficultyLevel: difficulty,
      acceptanceRate: parseFloat(questionData.acceptance_rate) || 0,
      totalSubmissions: parseInt(questionData.total_submissions) || 0,
      isPremium: questionData.is_premium
    };

    const analysis = {
      problemId: questionData.question_id,
      title: questionData.title,
      recommendation,
      recommendationReason: getRecommendationReason(recommendation, mathScore),
      estimatedSolvingTime: estimatedTime,
      difficulty,
      topics: topics.map(tag => tag.name || tag),
      learningOutcomes,
      likes: questionData.likes,
      dislikes: questionData.dislikes,
      likeRatio: Math.round((questionData.likes / (questionData.likes + questionData.dislikes + 1)) * 100),
      hasSolvedSimilar,
      solvedSimilarCount,
      insights,
      // Include new rating system data
      mathematicalScore: parseFloat(questionData.mathematical_score) || 3.0,
      aiScore: parseFloat(questionData.ai_score) || 3.0,
      aiReason: questionData.ai_reason,
      tags: {
        difficulty,
        likes: questionData.likes,
        dislikes: questionData.dislikes,
        acceptanceRate: insights.acceptanceRate,
        totalSubmissions: insights.totalSubmissions,
        isPremium: insights.isPremium
      },
      // User progress data
      userProgress: username ? {
        hasExperience: hasSolvedSimilar,
        matchingTopics: userTopics.filter(topic => 
          topics.map(t => t.name || t).includes(topic)
        ).map(topic => {
          const userSkill = userSkillsData.find(skill => skill.tagName === topic);
          return {
            name: topic,
            problemsSolved: userSkill ? userSkill.problemsSolved : 0,
            level: userSkill ? userSkill.level : 'unknown'
          };
        }),
        totalUserTopics: userTopics.length,
        skillLevel: userSkillsData.length > 0 ? 
          (userSkillsData.filter(s => s.level === 'advanced').length > 0 ? 'Advanced' :
           userSkillsData.filter(s => s.level === 'intermediate').length > 0 ? 'Intermediate' : 'Beginner') 
          : 'Beginner'
      } : null
    };

    // Cache the result
    req.cache.set(cacheKey, analysis);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing problem:', error.message);
    res.status(500).json({ error: 'Failed to analyze problem' });
  }
});

// Get similar problems based on topics
router.get('/similar/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { limit = 5 } = req.query;
    const cacheKey = `similar_${problemId}_${limit}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Get similar problems from database
    const parsedProblemId = parseInt(problemId);
    const parsedLimit = parseInt(limit);
    
    if (isNaN(parsedProblemId)) {
      return res.status(400).json({ error: 'Invalid problem ID' });
    }
    
    const similarProblems = await QuestionService.getSimilarQuestions(parsedProblemId, isNaN(parsedLimit) ? 5 : parsedLimit);
    const originalQuestion = await QuestionService.getQuestionById(parsedProblemId);
    
    if (!originalQuestion) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const result = {
      originalProblem: {
        id: originalQuestion.question_id,
        title: originalQuestion.title,
        topics: (originalQuestion.topic_tags || []).map(tag => tag.name || tag),
        mathematicalScore: originalQuestion.mathematical_score,
        aiScore: originalQuestion.ai_score
      },
      similarProblems: similarProblems.map(p => ({
        id: p.question_id,
        title: p.title,
        difficulty: p.difficulty,
        acceptanceRate: p.acceptance_rate,
        likes: p.likes,
        dislikes: p.dislikes,
        mathematicalScore: p.mathematical_score,
        aiScore: p.ai_score,
        aiReason: p.ai_reason
      }))
    };

    // Cache the result
    req.cache.set(cacheKey, result);
    
    res.json(result);
  } catch (error) {
    console.error('Error finding similar problems:', error.message);
    res.status(500).json({ error: 'Failed to find similar problems' });
  }
});

// Helper function to get topic descriptions
function getTopicDescription(topicName) {
  const descriptions = {
    'Array': 'Learn array manipulation, indexing, and common array algorithms',
    'String': 'Master string processing, pattern matching, and text algorithms',
    'Hash Table': 'Understand hashing concepts and efficient lookup operations',
    'Dynamic Programming': 'Learn optimization techniques and memoization strategies',
    'Math': 'Practice mathematical problem-solving and number theory',
    'Sorting': 'Master various sorting algorithms and their applications',
    'Greedy': 'Learn greedy algorithm design and optimization strategies',
    'Depth-First Search': 'Understand DFS traversal and graph exploration',
    'Binary Search': 'Master binary search technique and its variations',
    'Tree': 'Learn tree data structures and traversal algorithms',
    'Breadth-First Search': 'Understand BFS traversal and shortest path algorithms',
    'Two Pointers': 'Master two-pointer technique for array problems',
    'Binary Tree': 'Learn binary tree operations and traversals',
    'Heap (Priority Queue)': 'Understand heap data structure and priority operations',
    'Stack': 'Master stack operations and LIFO principle applications',
    'Backtracking': 'Learn recursive problem-solving with backtracking',
    'Simulation': 'Practice step-by-step problem simulation',
    'Graph': 'Understand graph algorithms and network problems',
    'Design': 'Learn system design and data structure implementation',
    'Linked List': 'Master linked list operations and pointer manipulation'
  };
  
  return descriptions[topicName] || `Learn concepts related to ${topicName}`;
}

// Helper function to get recommendation reason
function getRecommendationReason(recommendation, mathScore) {
  const score = (typeof mathScore === 'string' ? parseFloat(mathScore) : 3.0).toFixed(1);
  
  switch (recommendation) {
    case 'do':
      return `Highly recommended! Mathematical score: ${score}/5.0 - excellent problem quality.`;
    case 'ok':
      return `Worth solving. Mathematical score: ${score}/5.0 - decent problem quality.`;
    case 'pass':
      return `Consider skipping. Mathematical score: ${score}/5.0 - may have issues.`;
    default:
      return 'No specific recommendation available.';
  }
}

module.exports = router;
