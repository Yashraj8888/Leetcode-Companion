const axios = require('axios');
const { UserService, QuestionService } = require('./databaseService');

const LEETCODE_API_BASE = process.env.LEETCODE_API_BASE || 'http://localhost:3000';

/**
 * Sync service to update database with fresh data from LeetCode API
 */
class SyncService {
  /**
   * Sync user data from LeetCode API
   * @param {string} username - LeetCode username
   * @param {boolean} forceUpdate - Force update even if data is fresh
   * @returns {Object} User data from database
   */
  static async syncUserData(username, forceUpdate = false) {
    try {
      // Check if user data is stale or force update
      const isStale = await UserService.isUserDataStale(username);
      if (!isStale && !forceUpdate) {
        return await UserService.getUserByUsername(username);
      }

      console.log(`🔄 Syncing user data for: ${username}`);

      // Fetch all user data from API
      const [profileResponse, solvedResponse, contestResponse, languageResponse, skillResponse] = await Promise.allSettled([
        axios.get(`${LEETCODE_API_BASE}/${username}`),
        axios.get(`${LEETCODE_API_BASE}/${username}/solved`),
        axios.get(`${LEETCODE_API_BASE}/${username}/contest`),
        axios.get(`${LEETCODE_API_BASE}/languageStats?username=${username}`),
        axios.get(`${LEETCODE_API_BASE}/skillStats/${username}`)
      ]);

      const userData = {
        profileData: profileResponse.status === 'fulfilled' ? profileResponse.value.data : {},
        solvedProblems: solvedResponse.status === 'fulfilled' ? solvedResponse.value.data : {},
        contestData: contestResponse.status === 'fulfilled' ? contestResponse.value.data : {},
        languageStats: languageResponse.status === 'fulfilled' ? languageResponse.value.data : {},
        skillStats: skillResponse.status === 'fulfilled' ? skillResponse.value.data : {}
      };

      // Save to database
      const savedUser = await UserService.createOrUpdateUser(username, userData);
      console.log(`✅ User data synced for: ${username}`);
      
      return savedUser;
    } catch (error) {
      console.error(`❌ Error syncing user data for ${username}:`, error.message);
      // Return existing data if sync fails
      return await UserService.getUserByUsername(username);
    }
  }

  /**
   * Sync question data from LeetCode API
   * @param {string|number} identifier - Question ID or title slug
   * @param {boolean} forceUpdate - Force update even if data is fresh
   * @returns {Object} Question data from database
   */
  static async syncQuestionData(identifier, forceUpdate = false) {
    try {
      let questionId = identifier;
      let titleSlug = identifier;

      // If identifier is a number, we need to find the title slug
      if (!isNaN(identifier)) {
        questionId = parseInt(identifier);
        
        // Check if question exists in database first
        const existingQuestion = await QuestionService.getQuestionById(questionId);
        if (existingQuestion && !await QuestionService.isQuestionDataStale(questionId) && !forceUpdate) {
          return existingQuestion;
        }

        // Get title slug from API
        const problemsResponse = await axios.get(`${LEETCODE_API_BASE}/problems?limit=3000`);
        const problem = problemsResponse.data.problemsetQuestionList.find(p => 
          p.frontendQuestionId === identifier.toString()
        );
        
        if (!problem) {
          throw new Error('Problem not found');
        }
        
        titleSlug = problem.titleSlug;
      } else {
        // Check if question exists in database first
        const existingQuestion = await QuestionService.getQuestionBySlug(identifier);
        if (existingQuestion && !await QuestionService.isQuestionDataStale(existingQuestion.question_id) && !forceUpdate) {
          return existingQuestion;
        }
      }

      console.log(`🔄 Syncing question data for: ${identifier}`);

      // Get detailed problem information
      const detailResponse = await axios.get(`${LEETCODE_API_BASE}/select?titleSlug=${titleSlug}`);
      const problemDetails = detailResponse.data;

      if (!problemDetails) {
        throw new Error('Problem details not found');
      }

      // Get basic problem data from the problems list endpoint
      const problemsResponse = await axios.get(`${LEETCODE_API_BASE}/problems?limit=3000`);
      let problemData;
      
      if (isNaN(identifier)) {
        problemData = problemsResponse.data.problemsetQuestionList.find(p => 
          p.titleSlug === titleSlug
        );
      } else {
        problemData = problemsResponse.data.problemsetQuestionList.find(p => 
          p.frontendQuestionId === identifier.toString()
        );
      }

      // If not found in problems list, try to get additional data from a different endpoint
      if (!problemData || (!problemData.likes && !problemData.dislikes)) {
        try {
          const statsResponse = await axios.get(`${LEETCODE_API_BASE}/problems/${titleSlug}/stats`);
          if (statsResponse.data) {
            problemData = { ...problemData, ...statsResponse.data };
          }
        } catch (statsError) {
          console.log(`⚠️  Stats not available for ${titleSlug}`);
        }
      }

      // Debug: Log the API responses to see data structure
      console.log('🔍 Problem Data:', JSON.stringify(problemData, null, 2));
      console.log('🔍 Problem Details:', JSON.stringify(problemDetails, null, 2));
      
      // Try to get stats from additional API endpoint
      let statsData = {};
      try {
        const statsResponse = await axios.get(`${LEETCODE_API_BASE}/problems/${titleSlug}`);
        if (statsResponse.data && statsResponse.data.stats) {
          statsData = statsResponse.data.stats;
          console.log('🔍 Stats Data:', JSON.stringify(statsData, null, 2));
        }
      } catch (statsError) {
        console.log(`⚠️  Additional stats not available for ${titleSlug}`);
      }

      // Prepare question data for database
      const questionDataForDB = {
        questionId: parseInt(problemData?.frontendQuestionId || problemDetails.questionFrontendId),
        titleSlug: titleSlug,
        title: problemDetails.questionTitle || problemData?.title,
        difficulty: problemData?.difficulty || problemDetails.difficulty,
        likes: parseInt(problemData?.likes || problemDetails.likes || 0) || 0,
        dislikes: parseInt(problemData?.dislikes || problemDetails.dislikes || 0) || 0,
        acceptanceRate: parseFloat(problemData?.acRate || problemDetails.acRate || '0') || 0,
        totalSubmissions: parseInt(statsData?.totalSubmissions || problemData?.totalSubmitted || problemDetails.totalSubmitted || problemData?.totalSubmissions || problemDetails.totalSubmissions || problemData?.totalAccepted || problemDetails.totalAccepted || 0) || 0,
        tags: problemData?.topicTags || problemDetails.topicTags || [],
        topicTags: problemDetails.topicTags || problemData?.topicTags || [],
        content: problemDetails.content || '',
        hints: problemDetails.hints || [],
        similarQuestions: problemDetails.similarQuestions || [],
        isPremium: problemData?.isPaidOnly || problemDetails.isPaidOnly || false
      };

      // Save to database
      const savedQuestion = await QuestionService.createOrUpdateQuestion(questionDataForDB);
      console.log(`✅ Question data synced for: ${identifier}`);
      
      return savedQuestion;
    } catch (error) {
      console.error(`❌ Error syncing question data for ${identifier}:`, error.message);
      
      // Try to return existing data if sync fails
      if (!isNaN(identifier)) {
        return await QuestionService.getQuestionById(parseInt(identifier));
      } else {
        return await QuestionService.getQuestionBySlug(identifier);
      }
    }
  }

  /**
   * Sync multiple questions in batch
   * @param {Array} identifiers - Array of question IDs or slugs
   * @param {number} batchSize - Number of questions to process at once
   * @returns {Array} Array of synced question data
   */
  static async syncQuestionsInBatch(identifiers, batchSize = 5) {
    const results = [];
    
    for (let i = 0; i < identifiers.length; i += batchSize) {
      const batch = identifiers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(identifier => 
        this.syncQuestionData(identifier).catch(error => {
          console.error(`Failed to sync question ${identifier}:`, error.message);
          return null;
        })
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(result => result !== null));
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < identifiers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  /**
   * Get fresh data from API (bypass database)
   * @param {string} endpoint - API endpoint
   * @returns {Object} API response data
   */
  static async getFreshDataFromAPI(endpoint) {
    try {
      const response = await axios.get(`${LEETCODE_API_BASE}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching fresh data from ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * Sync daily problem
   * @returns {Object} Daily problem data
   */
  static async syncDailyProblem() {
    try {
      console.log('🔄 Syncing daily problem');
      const dailyData = await this.getFreshDataFromAPI('/daily');
      
      if (dailyData && dailyData.questionTitleSlug) {
        await this.syncQuestionData(dailyData.questionTitleSlug, true);
      }
      
      return dailyData;
    } catch (error) {
      console.error('❌ Error syncing daily problem:', error.message);
      throw error;
    }
  }
}

module.exports = SyncService;
