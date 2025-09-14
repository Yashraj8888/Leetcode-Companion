const express = require('express');
const axios = require('axios');
const router = express.Router();

const { UserService } = require('../services/databaseService');
const SyncService = require('../services/syncService');
const LEETCODE_API_BASE = process.env.LEETCODE_API_BASE;

// Get user profile information
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const cacheKey = `user_profile_${username}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Sync user data from database/API
    const userData = await SyncService.syncUserData(username);
    
    if (!userData || !userData.profile_data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get fresh profile data from userProfile API endpoint
    let profileData = userData.profile_data;
    let skillsData = [];
    
    try {
      // Fetch from the userProfile endpoint which has the correct structure
      const freshProfileData = await SyncService.getFreshDataFromAPI(`/userProfile/${username}`);
      if (freshProfileData) {
        profileData = freshProfileData;
      }
    } catch (error) {
      console.log('Could not fetch fresh profile data, using cached data');
    }

    try {
      // Fetch skills data from skillStats endpoint
      const skillStatsData = await SyncService.getFreshDataFromAPI(`/skillStats/${username}`);
      if (skillStatsData && skillStatsData.data && skillStatsData.data.matchedUser) {
        const tagProblemCounts = skillStatsData.data.matchedUser.tagProblemCounts;
        
        // Combine all skill levels
        const fundamental = tagProblemCounts.fundamental || [];
        const intermediate = tagProblemCounts.intermediate || [];
        const advanced = tagProblemCounts.advanced || [];
        
        skillsData = [
          ...fundamental.map(skill => ({ ...skill, level: 'fundamental' })),
          ...intermediate.map(skill => ({ ...skill, level: 'intermediate' })),
          ...advanced.map(skill => ({ ...skill, level: 'advanced' }))
        ];
      }
    } catch (error) {
      console.log('Could not fetch skills data:', error.message);
    }
    
    // Fix totalSolved count - it should come from the profile data
    const fixedProfileData = {
      ...profileData,
      totalSolved: profileData.totalSolved || profileData.solvedProblem || 0,
      ranking: profileData.ranking || profileData.globalRanking || 'N/A',
      contributionPoints: profileData.contributionPoints || profileData.contributionPoint || 0,
      reputation: profileData.reputation || 0,
      skills: skillsData.map(skill => skill.tagName),
      topicTags: skillsData.map(skill => ({
        name: skill.tagName,
        slug: skill.tagSlug,
        count: skill.problemsSolved,
        level: skill.level
      }))
    };

    // Cache the result
    req.cache.set(cacheKey, fixedProfileData);
    
    res.json(fixedProfileData);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get user's solved problems
router.get('/solved/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const cacheKey = `user_solved_${username}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Sync user data from database/API
    const userData = await SyncService.syncUserData(username);
    
    if (!userData || !userData.solved_problems) {
      return res.status(404).json({ error: 'User solved problems not found' });
    }

    // Get fresh solved problems data from userProfile API endpoint
    let solvedData = userData.solved_problems;
    
    try {
      // Fetch from the userProfile endpoint which has the correct structure
      const freshProfileData = await SyncService.getFreshDataFromAPI(`/userProfile/${username}`);
      if (freshProfileData) {
        solvedData = {
          easySolved: freshProfileData.easySolved || 0,
          mediumSolved: freshProfileData.mediumSolved || 0,
          hardSolved: freshProfileData.hardSolved || 0,
          totalEasy: freshProfileData.totalEasy || 0,
          totalMedium: freshProfileData.totalMedium || 0,
          totalHard: freshProfileData.totalHard || 0,
          recentSubmissions: freshProfileData.recentSubmissions || []
        };
      }
    } catch (error) {
      console.log('Could not fetch fresh solved data, using cached data');
      // Fallback to default structure
      solvedData = {
        easySolved: solvedData.easySolved || solvedData.solvedProblem?.Easy || 0,
        mediumSolved: solvedData.mediumSolved || solvedData.solvedProblem?.Medium || 0,
        hardSolved: solvedData.hardSolved || solvedData.solvedProblem?.Hard || 0,
        totalEasy: 800, // Default values
        totalMedium: 1700,
        totalHard: 700,
        recentSubmissions: solvedData.recentSubmissions || []
      };
    }

    const fixedSolvedData = solvedData;

    // Cache the result
    req.cache.set(cacheKey, fixedSolvedData);
    
    res.json(fixedSolvedData);
  } catch (error) {
    console.error('Error fetching user solved problems:', error.message);
    res.status(500).json({ error: 'Failed to fetch user solved problems' });
  }
});

// Get user's accepted submissions
router.get('/submissions/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { limit = 20 } = req.query;
    const cacheKey = `user_submissions_${username}_${limit}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Get fresh submissions data from API (this changes frequently)
    const response = await SyncService.getFreshDataFromAPI(`/${username}/acSubmission?limit=${limit}`);
    
    if (!response) {
      return res.status(404).json({ error: 'User submissions not found' });
    }

    // Cache the result for shorter time
    req.cache.set(cacheKey, response, 1800); // 30 minutes
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching user submissions:', error.message);
    res.status(500).json({ error: 'Failed to fetch user submissions' });
  }
});

// Get user's contest information
router.get('/contest/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const cacheKey = `user_contest_${username}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Sync user data from database/API
    const userData = await SyncService.syncUserData(username);
    
    if (!userData || !userData.contest_data) {
      return res.status(404).json({ error: 'User contest info not found' });
    }

    // Cache the result
    req.cache.set(cacheKey, userData.contest_data);
    
    res.json(userData.contest_data);
  } catch (error) {
    console.error('Error fetching user contest info:', error.message);
    res.status(500).json({ error: 'Failed to fetch user contest info' });
  }
});

// Get user's language statistics
router.get('/language-stats/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const cacheKey = `user_lang_stats_${username}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Sync user data from database/API
    const userData = await SyncService.syncUserData(username);
    
    if (!userData || !userData.language_stats) {
      return res.status(404).json({ error: 'User language stats not found' });
    }

    // Cache the result
    req.cache.set(cacheKey, userData.language_stats);
    
    res.json(userData.language_stats);
  } catch (error) {
    console.error('Error fetching user language stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch user language stats' });
  }
});

// Get user's skill statistics
router.get('/skill-stats/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const cacheKey = `user_skill_stats_${username}`;
    
    // Check cache first
    const cached = req.cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let skillsData = [];
    
    try {
      // Fetch skills data from skillStats endpoint
      const skillStatsData = await SyncService.getFreshDataFromAPI(`/skillStats/${username}`);
      if (skillStatsData && skillStatsData.data && skillStatsData.data.matchedUser) {
        const tagProblemCounts = skillStatsData.data.matchedUser.tagProblemCounts;
        
        // Combine all skill levels
        const fundamental = tagProblemCounts.fundamental || [];
        const intermediate = tagProblemCounts.intermediate || [];
        const advanced = tagProblemCounts.advanced || [];
        
        skillsData = [
          ...fundamental.map(skill => ({ ...skill, level: 'fundamental' })),
          ...intermediate.map(skill => ({ ...skill, level: 'intermediate' })),
          ...advanced.map(skill => ({ ...skill, level: 'advanced' }))
        ];
      }
    } catch (error) {
      console.log('Could not fetch skills data:', error.message);
      // Fallback to cached data if available
      const userData = await SyncService.syncUserData(username);
      if (userData && userData.skill_stats) {
        return res.json(userData.skill_stats);
      }
    }

    // Get total problems count for each tag from problems API
    let tagTotalCounts = {};
    try {
      const problemsResponse = await SyncService.getFreshDataFromAPI('/problems?limit=3000');
      if (problemsResponse && problemsResponse.problemsetQuestionList) {
        const problems = problemsResponse.problemsetQuestionList;
        
        // Count total problems for each tag
        problems.forEach(problem => {
          if (problem.topicTags) {
            problem.topicTags.forEach(tag => {
              const tagName = tag.name;
              tagTotalCounts[tagName] = (tagTotalCounts[tagName] || 0) + 1;
            });
          }
        });
      }
    } catch (error) {
      console.log('Could not fetch problems for tag counts, using estimates');
    }

    // Format data to match frontend expectations
    const formattedSkillStats = {
      data: skillsData.map(skill => {
        const totalProblems = tagTotalCounts[skill.tagName] || Math.max(skill.problemsSolved * 3, 50); // Estimate if not found
        return {
          tagName: skill.tagName,
          tagSlug: skill.tagSlug,
          problemsSolved: skill.problemsSolved,
          tagProblemsCount: totalProblems,
          level: skill.level
        };
      })
    };

    // Cache the result
    req.cache.set(cacheKey, formattedSkillStats);
    
    res.json(formattedSkillStats);
  } catch (error) {
    console.error('Error fetching user skill stats:', error.message);
    res.status(500).json({ error: 'Failed to fetch user skill stats' });
  }
});

module.exports = router;
