import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  FiUser, 
  FiTrendingUp, 
  FiCode, 
  FiAward,
  FiCalendar,
  FiTarget,
  FiBarChart2,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';

const UserProfile = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [solved, setSolved] = useState(null);
  const [languageStats, setLanguageStats] = useState(null);
  const [skillStats, setSkillStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username]);

  const fetchUserData = async () => {
    if (!username) {
      toast.error('Please set your username first');
      return;
    }

    setLoading(true);
    try {
      const [profileRes, solvedRes, langRes, skillRes] = await Promise.allSettled([
        axios.get(`/api/users/profile/${username}`),
        axios.get(`/api/users/solved/${username}`),
        axios.get(`/api/users/language-stats/${username}`),
        axios.get(`/api/users/skill-stats/${username}`)
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.data);
      }
      if (solvedRes.status === 'fulfilled') {
        setSolved(solvedRes.value.data);
      }
      if (langRes.status === 'fulfilled') {
        setLanguageStats(langRes.value.data);
      }
      if (skillRes.status === 'fulfilled') {
        setSkillStats(skillRes.value.data);
      }

      toast.success('Profile data loaded successfully!');
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-success-600 bg-success-100';
      case 'medium':
        return 'text-warning-600 bg-warning-100';
      case 'hard':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-secondary-600 bg-secondary-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'languages', label: 'Languages', icon: FiBarChart2 },
    { id: 'skills', label: 'Skills', icon: FiTarget }
  ];

  if (!username) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 text-center">
          <FiAlertCircle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-dark-800 mb-2">
            Username Required
          </h2>
          <p className="text-secondary-600 dark:text-dark-600 mb-4">
            Please set your LeetCode username in the header to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-dark-800">
            Profile Dashboard
          </h1>
          <p className="text-lg text-secondary-600 dark:text-dark-600">
            {username}'s LeetCode Statistics
          </p>
        </div>
        <button
          onClick={fetchUserData}
          disabled={loading}
          className="btn-primary btn-md flex items-center space-x-2"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 p-1 bg-secondary-100 dark:bg-dark-200 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-dark-100 text-primary-600 shadow-sm'
                    : 'text-secondary-600 dark:text-dark-600 hover:text-secondary-900 dark:hover:text-dark-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="card p-8 text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-secondary-600 dark:text-dark-600">Loading profile data...</p>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6 text-center">
              <FiTrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-secondary-900 dark:text-dark-800 mb-1">
                {profile.ranking || 'N/A'}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-600">
                Global Ranking
              </div>
            </div>

            <div className="card p-6 text-center">
              <FiCode className="w-8 h-8 text-success-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-secondary-900 dark:text-dark-800 mb-1">
                {profile.totalSolved || 0}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-600">
                Problems Solved
              </div>
            </div>

            <div className="card p-6 text-center">
              <FiAward className="w-8 h-8 text-warning-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-secondary-900 dark:text-dark-800 mb-1">
                {profile.contributionPoints || 0}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-600">
                Contribution Points
              </div>
            </div>

            <div className="card p-6 text-center">
              <FiCalendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-secondary-900 dark:text-dark-800 mb-1">
                {profile.reputation || 0}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-600">
                Reputation
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          {solved && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-800 mb-4">
                Problems by Difficulty
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                  <div>
                    <div className="text-lg font-bold text-success-700 dark:text-success-400">
                      {solved.easySolved || 0}
                    </div>
                    <div className="text-sm text-success-600 dark:text-success-500">
                      Easy Problems
                    </div>
                  </div>
                  <div className="text-xs text-success-600 dark:text-success-500">
                    / {solved.totalEasy || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                  <div>
                    <div className="text-lg font-bold text-warning-700 dark:text-warning-400">
                      {solved.mediumSolved || 0}
                    </div>
                    <div className="text-sm text-warning-600 dark:text-warning-500">
                      Medium Problems
                    </div>
                  </div>
                  <div className="text-xs text-warning-600 dark:text-warning-500">
                    / {solved.totalMedium || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
                  <div>
                    <div className="text-lg font-bold text-danger-700 dark:text-danger-400">
                      {solved.hardSolved || 0}
                    </div>
                    <div className="text-sm text-danger-600 dark:text-danger-500">
                      Hard Problems
                    </div>
                  </div>
                  <div className="text-xs text-danger-600 dark:text-danger-500">
                    / {solved.totalHard || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}


      {/* Languages Tab */}
      {activeTab === 'languages' && languageStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-800 mb-4">
              Programming Languages
            </h3>
            {languageStats.matchedUser && languageStats.matchedUser.languageProblemCount ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languageStats.matchedUser.languageProblemCount.map((lang, index) => (
                  <div key={index} className="p-4 bg-secondary-50 dark:bg-dark-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-secondary-900 dark:text-dark-800">
                        {lang.languageName}
                      </span>
                      <span className="text-sm text-secondary-600 dark:text-dark-600">
                        {lang.problemsSolved} problems
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200 dark:bg-dark-300 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((lang.problemsSolved / Math.max(...languageStats.matchedUser.languageProblemCount.map(l => l.problemsSolved))) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-600 dark:text-dark-600">No language statistics available.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && skillStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-800 mb-4">
              Skill Areas
            </h3>
            {skillStats.data && skillStats.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillStats.data.map((skill, index) => (
                  <div key={index} className="p-4 bg-secondary-50 dark:bg-dark-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-secondary-900 dark:text-dark-800">
                        {skill.tagName}
                      </span>
                      <span className="text-sm text-secondary-600 dark:text-dark-600">
                        {skill.problemsSolved} / {skill.tagProblemsCount}
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200 dark:bg-dark-300 rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(skill.problemsSolved / skill.tagProblemsCount) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-secondary-600 dark:text-dark-600">
                      {((skill.problemsSolved / skill.tagProblemsCount) * 100).toFixed(1)}% completed
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-600 dark:text-dark-600">No skill statistics available.</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
