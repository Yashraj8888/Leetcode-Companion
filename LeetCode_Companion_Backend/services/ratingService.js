const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Tag weights for importance adjustment
const TAG_WEIGHTS = {
  "Dynamic Programming": 1.2,
  "Graph": 1.2,
  "System Design": 1.3,
  "Array": 1.0,
  "String": 0.9,
  "Hash Table": 1.0,
  "Math": 0.8,
  "Parsing": 0.6,
  "Tree": 1.1,
  "Binary Tree": 1.1,
  "Depth-First Search": 1.1,
  "Breadth-First Search": 1.1,
  "Binary Search": 1.0,
  "Two Pointers": 1.0,
  "Sliding Window": 1.1,
  "Backtracking": 1.2,
  "Greedy": 1.1,
  "Heap (Priority Queue)": 1.2,
  "Stack": 0.9,
  "Queue": 0.9,
  "Linked List": 1.0,
  "Sorting": 0.9,
  "Bit Manipulation": 1.1,
  "Trie": 1.2,
  "Union Find": 1.3,
  "Segment Tree": 1.4,
  "Binary Indexed Tree": 1.4
};

/**
 * Calculate mathematical score based on multiple factors
 * @param {Object} questionData - Question data object
 * @returns {number} Mathematical score (1-5, rounded to 1 decimal)
 */
function calculateMathematicalScore(questionData) {
  const {
    likes = 0,
    dislikes = 0,
    acceptanceRate = 50,
    questionNumber = 1,
    maxQuestionId = 3000,
    difficulty = 'Medium',
    tags = []
  } = questionData;

  // Debug logging
  console.log('🔍 Debug calculation for question:', questionNumber);

  // 1. Popularity-adjusted like score (40% weight)
  const likeRatio = likes / (likes + dislikes + 1e-5);

  // Calculate popularity percentage (0-100) based on like thresholds
  let popularityPercentage;
  if (likes < 1000) popularityPercentage = 50; // not popular
  else if (likes < 2000) popularityPercentage = 80; // very less popular
  else if (likes < 4000) popularityPercentage = 90; // somewhat popular
  else if (likes < 6000) popularityPercentage = 95; // slightly popular
  else if (likes < 8000) popularityPercentage = 99; // popular
  else if (likes < 10000) popularityPercentage = 99; // very popular
  else popularityPercentage = 99; // extremely popular

  const popularityFactor = Math.log1p(likes);
  const popularityWeight = Math.min(1.0, popularityFactor / Math.log1p(10000));
  // Convert percentage to multiplier (0.5 to 1.0 scale)
  const popularityMultiplier = 0.5 + (popularityPercentage / 100 * 0.5);
  let likeComponent = likeRatio * 5 * popularityWeight * popularityMultiplier;
  
  // Store the popularity percentage for the frontend
  questionData.popularityPercentage = popularityPercentage;

  // Penalize if dislikes > likes
  if (dislikes > likes) {
    likeComponent *= 0.5; // drastic fall
  }

  // 2. Acceptance rate score (20% weight)
  let acceptanceComponent;
  if (acceptanceRate >= 35 && acceptanceRate <= 60) {
    acceptanceComponent = 5;
  } else if (acceptanceRate >= 20 && acceptanceRate < 35) {
    acceptanceComponent = 4;
  } else if (acceptanceRate > 60 && acceptanceRate <= 80) {
    acceptanceComponent = 4.5;
  } else if (acceptanceRate > 80) {
    acceptanceComponent = 4;
  } else {
    acceptanceComponent = 2;
  }

  // 3. Age factor (20% weight)
  const safeMaxQuestionId = Math.max(maxQuestionId, questionNumber + 100);
  const ageRatio = Math.max(0, Math.min(1, (safeMaxQuestionId - questionNumber) / safeMaxQuestionId));
  const ageComponent = 2 + (ageRatio * 3);

  // 4. Difficulty score (10% weight)
  let diffComponent;
  switch (difficulty.toLowerCase()) {
    case 'easy': diffComponent = 4; break;
    case 'medium': diffComponent = 5; break;
    case 'hard': diffComponent = 3; break;
    default: diffComponent = 4;
  }

  // 5. Tag importance adjustment
  let tagMultiplier = 1.0;
  if (tags && tags.length > 0) {
    const tagWeights = tags.map(tag => TAG_WEIGHTS[tag] || 1.0);
    tagMultiplier = tagWeights.reduce((sum, weight) => sum + weight, 0) / tagWeights.length;
  }
  const tagComponent = (tagMultiplier - 1.0) * 5 * 0.1;

  // 6. Final score
  const finalScore = (
    0.6 * likeComponent +
    0.1 * acceptanceComponent +
    0.1 * ageComponent +
    0.1 * diffComponent +
    tagComponent
  );

  // Clamp between 1 and 5
  return Math.round(Math.max(1, Math.min(5, finalScore)) * 10) / 10;
}



/**
 * Get AI-based rating and reason using Gemini
 * @param {Object} questionData - Question data object
 * @returns {Object} AI score and reason
 */
async function getAIRating(questionData) {
  try {
    const {
      title = '',
      difficulty = 'Medium',
      tags = [],
      likes = 0,
      dislikes = 0,
      acceptanceRate = 50,
      content = ''
    } = questionData;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert LeetCode problem analyst. Rate this LeetCode problem on a scale of 1-5 stars and provide a brief one-liner reason.

Problem Details:
- Title: ${title}
- Difficulty: ${difficulty}
- Tags: ${tags.join(', ')}
- Likes: ${likes}
- Dislikes: ${dislikes}
- Acceptance Rate: ${acceptanceRate}%

Consider these factors for rating:
- Problem quality and clarity
- Educational value for learning algorithms/data structures
- Practical relevance for interviews
- Problem uniqueness and creativity
- Balance between difficulty and learning outcome

Respond in this exact JSON format:
{
  "score": <integer from 1 to 5>,
  "reason": "<one-liner explanation under 100 characters>"
}

Example:
{
  "score": 4,
  "reason": "Classic DP problem with excellent learning value for interviews"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiResponse = JSON.parse(jsonMatch[0]);
      return {
        aiScore: Math.max(1.0, Math.min(5.0, parseFloat(aiResponse.score) || 3.0)),
        aiReason: aiResponse.reason || "AI analysis completed"
      };
    }

    // Fallback if parsing fails
    return {
      aiScore: 3.0,
      aiReason: "AI analysis completed"
    };

  } catch (error) {
    console.error('Error getting AI rating:', error);
    // Return mathematical score as fallback when AI fails
    const mathScore = calculateMathematicalScore(questionData);
    return {
      aiScore: mathScore,
      aiReason: "AI unavailable - using mathematical score"
    };
  }
}

/**
 * Calculate both mathematical and AI ratings for a question
 * @param {Object} questionData - Question data object
 * @returns {Object} Combined rating result
 */
async function calculateQuestionRating(questionData) {
  try {
    const mathematicalScore = calculateMathematicalScore(questionData);
    const { aiScore, aiReason } = await getAIRating(questionData);

    return {
      mathematicalScore,
      aiScore,
      aiReason
    };
  } catch (error) {
    console.error('Error calculating question rating:', error);
    return {
      mathematicalScore: 3.0,
      aiScore: 3.0,
      aiReason: "Rating calculation failed"
    };
  }
}

module.exports = {
  calculateMathematicalScore,
  getAIRating,
  calculateQuestionRating,
  TAG_WEIGHTS
};
