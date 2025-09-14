import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  FiSearch, 
  FiBarChart2, 
  FiClock, 
  FiTarget, 
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
  FiThumbsUp,
  FiThumbsDown,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiBookOpen,
  FiZap,
  FiRefreshCw,
  FiStar,
  FiCpu,
  FiSettings
} from 'react-icons/fi';

const ProblemAnalysis = ({ username }) => {
  const [problemInput, setProblemInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showTopics, setShowTopics] = useState(false);
  const [similarProblems, setSimilarProblems] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const handleAnalyze = async (e, forceRefresh = false) => {
    if (e) e.preventDefault();
    
    if (!problemInput.trim()) {
      toast.error('Please enter a problem number or URL');
      return;
    }

    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    if (!forceRefresh) {
      setAnalysis(null);
      setSimilarProblems([]);
    }

    try {
      // Extract problem identifier from input
      let problemId = problemInput.trim();
      
      // If it's a URL, extract the problem slug or number
      if (problemId.includes('leetcode.com')) {
        const urlMatch = problemId.match(/problems\/([^/]+)/);
        if (urlMatch) {
          problemId = urlMatch[1];
        }
      }
      
      // If it's just a number, we need to convert it to a problem slug
      // First check if it's a pure number
      if (/^\d+$/.test(problemId)) {
        // It's a problem number, we'll let the backend handle the conversion
        // The backend will need to map problem numbers to slugs
        problemId = `problem-${problemId}`;
      }

      // Make API call to analyze the problem
      const response = await axios.post('/api/analysis/analyze', {
        problemId,
        username: username || undefined,
        forceRefresh
      });

      setAnalysis(response.data);
      toast.success(forceRefresh ? 'Problem refreshed successfully!' : 'Problem analyzed successfully!');

      // Fetch similar problems
      if (!forceRefresh) {
        fetchSimilarProblems(problemId);
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to analyze problem';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (!analysis) {
      toast.error('Please analyze a problem first');
      return;
    }
    handleAnalyze(null, true);
  };

  const fetchSimilarProblems = async (problemId) => {
    setLoadingSimilar(true);
    try {
      const response = await axios.get(`/api/analysis/similar/${problemId}?limit=5`);
      setSimilarProblems(response.data.similarProblems || []);
    } catch (error) {
      console.error('Error fetching similar problems:', error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case 'do':
        return <FiCheckCircle className="w-5 h-5 text-success-600" />;
      case 'ok':
        return <FiAlertCircle className="w-5 h-5 text-warning-600" />;
      case 'pass':
        return <FiXCircle className="w-5 h-5 text-danger-600" />;
      default:
        return <FiTarget className="w-5 h-5 text-secondary-600" />;
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'do':
        return 'badge-do';
      case 'ok':
        return 'badge-ok';
      case 'pass':
        return 'badge-pass';
      default:
        return 'badge';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'badge-easy';
      case 'medium':
        return 'badge-medium';
      case 'hard':
        return 'badge-hard';
      default:
        return 'badge';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-dark-800">
          Problem Analysis
        </h1>
        <p className="text-lg text-secondary-600 dark:text-dark-600">
          Get intelligent insights and recommendations for any LeetCode problem
        </p>
      </div>

      {/* Search Form */}
      <div className="card p-6">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700 dark:text-dark-700">
              Problem Number or URL
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                placeholder="Enter problem number (e.g., '1', '29'), slug (e.g., 'two-sum'), or URL"
                className="w-full pl-10 pr-4 py-3 border border-secondary-300 dark:border-dark-400 rounded-lg bg-white dark:bg-dark-100 text-secondary-900 dark:text-dark-800 placeholder-secondary-500 dark:placeholder-dark-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading || refreshing}
              className="btn-primary btn-md flex-1 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-4 h-4" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <FiBarChart2 className="w-4 h-4" />
                  <span>Analyze Problem</span>
                </>
              )}
            </button>
            
            {analysis && (
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="btn-secondary btn-md px-3 flex items-center justify-center"
                title="Refresh analysis and override database"
              >
                {refreshing ? (
                  <div className="loading-spinner w-4 h-4" />
                ) : (
                  <FiRefreshCw className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Problem Header */}
            <div className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-800">
                    {analysis.title}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className={`badge ${getDifficultyColor(analysis.difficulty)}`}>
                      {analysis.difficulty}
                    </span>
                    <span className="text-sm text-secondary-600 dark:text-dark-600">
                      Problem #{analysis.problemId}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getRecommendationIcon(analysis.recommendation)}
                  <span className={`badge ${getRecommendationColor(analysis.recommendation)} text-sm font-semibold`}>
                    {analysis.recommendation.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating System - New Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Mathematical Rating */}
              <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
                <div className="flex justify-center mb-3">
                  <FiCpu className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Mathematical Score
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analysis.mathematicalScore && typeof analysis.mathematicalScore === 'number' ? analysis.mathematicalScore.toFixed(1) : '3.0'}/5.0
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(typeof analysis.mathematicalScore === 'number' ? analysis.mathematicalScore : 3.0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Based on likes, acceptance rate, age & difficulty
                </p>
              </div>

              {/* AI Rating */}
              <div className="card p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
                <div className="flex justify-center mb-3">
                  <FiSettings className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  AI Score
                </h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {typeof analysis.aiScore === 'number' ? analysis.aiScore.toFixed(1) : (analysis.mathematicalScore && typeof analysis.mathematicalScore === 'number' ? analysis.mathematicalScore.toFixed(1) : '3.0')}/5.0
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(typeof analysis.aiScore === 'number' ? analysis.aiScore : (typeof analysis.mathematicalScore === 'number' ? analysis.mathematicalScore : 3.0))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  {analysis.aiReason || 'AI-powered quality assessment'}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recommendation */}
              <div className="card p-6 text-center">
                <div className="flex justify-center mb-3">
                  {getRecommendationIcon(analysis.recommendation)}
                </div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-800 mb-2">
                  Recommendation
                </h3>
                <p className="text-sm text-secondary-600 dark:text-dark-600">
                  {analysis.recommendationReason}
                </p>
              </div>

              {/* Estimated Time */}
              <div className="card p-6 text-center">
                <FiClock className="w-6 h-6 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold text-secondary-900 dark:text-dark-800 mb-2">
                  Estimated Time
                </h3>
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {analysis.estimatedSolvingTime}m
                </div>
                <p className="text-xs text-secondary-600 dark:text-dark-600">
                  Based on difficulty & acceptance rate
                </p>
              </div>

              {/* Community Feedback */}
              <div className="card p-6 text-center">
                <FiTrendingUp className="w-6 h-6 text-success-600 mx-auto mb-3" />
                <h3 className="font-semibold text-secondary-900 dark:text-dark-800 mb-2">
                  Community Rating
                </h3>
                <div className="text-2xl font-bold text-success-600 mb-1">
                  {analysis.likeRatio}%
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <FiThumbsUp className="w-3 h-3 text-success-600" />
                    <span>{analysis.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiThumbsDown className="w-3 h-3 text-danger-600" />
                    <span>{analysis.dislikes}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Topics */}
            <div className="card">
              <button
                onClick={() => setShowTopics(!showTopics)}
                className="w-full p-6 flex items-center justify-between hover:bg-secondary-50 dark:hover:bg-dark-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FiBookOpen className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-800">
                    Learning Outcomes ({analysis.learningOutcomes.length} topics)
                  </h3>
                </div>
                {showTopics ? (
                  <FiChevronUp className="w-5 h-5 text-secondary-600" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-secondary-600" />
                )}
              </button>
              
              <AnimatePresence>
                {showTopics && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-secondary-200 dark:border-dark-200"
                  >
                    <div className="p-6 space-y-4">
                      {analysis.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <FiZap className="w-4 h-4 text-warning-500 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-secondary-900 dark:text-dark-800">
                              {outcome.name}
                            </h4>
                            <p className="text-sm text-secondary-600 dark:text-dark-600 mt-1">
                              {outcome.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Problem Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-800 mb-4">
                Problem Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary-900 dark:text-dark-800">
                    {typeof analysis.insights?.acceptanceRate === 'number' ? analysis.insights.acceptanceRate.toFixed(1) : '0.0'}%
                  </div>
                  <div className="text-xs text-secondary-600 dark:text-dark-600">
                    Acceptance Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary-900 dark:text-dark-800">
                    {typeof analysis.insights?.totalSubmissions === 'number' && analysis.insights.totalSubmissions > 0 ? analysis.insights.totalSubmissions.toLocaleString() : 'N/A'}
                  </div>
                  <div className="text-xs text-secondary-600 dark:text-dark-600">
                    Total Submissions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary-900 dark:text-dark-800">
                    {typeof analysis.insights?.popularityScore === 'number' ? analysis.insights.popularityScore + '%' : 'N/A'}
                  </div>
                  <div className="text-xs text-secondary-600 dark:text-dark-600">
                    Popularity Score
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${analysis.insights?.isPremium ? 'text-warning-600' : 'text-success-600'}`}>
                    {analysis.insights?.isPremium ? 'Premium' : 'Free'}
                  </div>
                  <div className="text-xs text-secondary-600 dark:text-dark-600">
                    Access Level
                  </div>
                </div>
              </div>
            </div>

            {/* User Progress (if username provided) */}
            {username && analysis.userProgress && (
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FiUsers className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-800">
                    Your Progress
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {/* Overall Experience */}
                  <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-dark-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${analysis.userProgress.hasExperience ? 'bg-success-500' : 'bg-warning-500'}`}></div>
                      <span className="font-medium text-secondary-900 dark:text-dark-800">
                        Experience Level
                      </span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      analysis.userProgress.skillLevel === 'Advanced' ? 'bg-success-100 text-success-700' :
                      analysis.userProgress.skillLevel === 'Intermediate' ? 'bg-warning-100 text-warning-700' :
                      'bg-secondary-100 text-secondary-700'
                    }`}>
                      {analysis.userProgress.skillLevel}
                    </span>
                  </div>

                  {/* Matching Topics */}
                  {analysis.userProgress.matchingTopics.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-secondary-700 dark:text-dark-700 mb-2">
                        Relevant Skills ({analysis.userProgress.matchingTopics.length} topics)
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {analysis.userProgress.matchingTopics.map((topic, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-primary-50 dark:bg-dark-300 rounded">
                            <div className="flex items-center space-x-2">
                              <FiCheckCircle className="w-4 h-4 text-success-600" />
                              <span className="text-sm font-medium text-secondary-900 dark:text-dark-800">
                                {topic.name}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                topic.level === 'advanced' ? 'bg-success-100 text-success-700' :
                                topic.level === 'intermediate' ? 'bg-warning-100 text-warning-700' :
                                'bg-secondary-100 text-secondary-700'
                              }`}>
                                {topic.level}
                              </span>
                            </div>
                            <span className="text-xs text-secondary-600 dark:text-dark-600">
                              {topic.problemsSolved} solved
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-warning-50 dark:bg-dark-300 rounded-lg">
                      <FiAlertCircle className="w-4 h-4 text-warning-600" />
                      <span className="text-sm text-warning-700 dark:text-warning-600">
                        No experience with these topics yet. This could be a learning opportunity!
                      </span>
                    </div>
                  )}

                  {/* Overall Stats */}
                  <div className="flex items-center justify-between text-xs text-secondary-600 dark:text-dark-600 pt-2 border-t border-secondary-200 dark:border-dark-400">
                    <span>Total topics mastered: {analysis.userProgress.totalUserTopics}</span>
                    <span>Matching topics: {analysis.userProgress.matchingTopics.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Problems */}
            {similarProblems.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-800">
                    Similar Problems
                  </h3>
                  {loadingSimilar && (
                    <FiRefreshCw className="w-4 h-4 animate-spin text-primary-600" />
                  )}
                </div>
                <div className="space-y-3">
                  {similarProblems.map((problem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-dark-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-secondary-900 dark:text-dark-800">
                          {problem.id}. {problem.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`badge ${getDifficultyColor(problem.difficulty)} text-xs`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-xs text-secondary-600 dark:text-dark-600">
                            {typeof problem.acceptanceRate === 'number' ? problem.acceptanceRate.toFixed(1) : '0.0'}% acceptance
                          </span>
                        </div>
                        {/* Rating indicators for similar problems */}
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center space-x-1">
                            <FiCpu className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">
                              {problem.mathematicalScore && typeof problem.mathematicalScore === 'number' ? problem.mathematicalScore.toFixed(1) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiSettings className="w-3 h-3 text-purple-600" />
                            <span className="text-xs text-purple-600 font-medium">
                              {problem.aiScore || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <FiThumbsUp className="w-3 h-3 text-success-600" />
                          <span>{problem.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiThumbsDown className="w-3 h-3 text-danger-600" />
                          <span>{problem.dislikes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProblemAnalysis;
