import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiBarChart2, 
  FiTarget, 
  FiClock, 
  FiTrendingUp, 
  FiUsers, 
  FiArrowRight,
  FiCode,
  FiStar,
  FiZap,
  FiCpu,
  FiSettings,
  FiCheckCircle,
  FiXCircle,
  FiThumbsUp,
  FiThumbsDown
} from 'react-icons/fi';

const Home = () => {
  const features = [
    {
      icon: FiTarget,
      title: 'Smart Recommendations',
      description: 'Get AI-powered suggestions on whether to solve, practice, or skip problems based on community feedback.',
      color: 'text-success-600'
    },
    {
      icon: FiClock,
      title: 'Time Estimation',
      description: 'Know how long a problem might take to solve based on difficulty and acceptance rates.',
      color: 'text-primary-600'
    },
    {
      icon: FiBarChart2,
      title: 'Learning Outcomes',
      description: 'Discover what topics and concepts you\'ll learn from each problem before you start.',
      color: 'text-warning-600'
    },
    {
      icon: FiUsers,
      title: 'Progress Tracking',
      description: 'See if you\'ve solved similar problems and track your learning journey across topics.',
      color: 'text-purple-600'
    }
  ];

  const stats = [
    { label: 'Problems Analyzed', value: '3000+', icon: FiCode },
    { label: 'Success Rate', value: '95%', icon: FiTrendingUp },
    { label: 'Time Saved', value: '50%', icon: FiClock },
    { label: 'User Rating', value: '4.9/5', icon: FiStar }
  ];

  // Example analysis data
  const exampleAnalyses = [
    {
      title: "Two Sum",
      problemNumber: 1,
      difficulty: "Easy",
      recommendation: "DO",
      mathematicalScore: 4.3,
      aiScore: 4.0,
      aiReason: "Fundamental problem showcasing hash table efficiency; excellent interview starter.",
      estimatedTime: "24m",
      communityRating: 96,
      likes: 15420,
      dislikes: 489,
      recommendationColor: "text-success-600",
      recommendationBg: "bg-success-100",
      recommendationIcon: FiCheckCircle
    },
    {
      title: "Divide Two Integers",
      problemNumber: 29,
      difficulty: "Medium", 
      recommendation: "PASS",
      mathematicalScore: 1.5,
      aiScore: 3.0,
      aiReason: "Bit manipulation is insightful, but the problem is tricky and has low practical relevance.",
      estimatedTime: "67m",
      communityRating: 28,
      likes: 3240,
      dislikes: 8150,
      recommendationColor: "text-danger-600",
      recommendationBg: "bg-danger-100",
      recommendationIcon: FiXCircle
    }
  ];

  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <FiStar key={i} className="w-4 h-4 text-yellow-500 fill-current" />
        ))}
        {hasHalfStar && <FiStar className="w-4 h-4 text-yellow-500 fill-current opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FiStar key={i} className="w-4 h-4 text-secondary-300 dark:text-dark-500" />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-medium">
            <FiZap className="w-4 h-4" />
            <span>Powered by Advanced Analytics</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 dark:text-dark-800 leading-tight">
            Master LeetCode with
            <span className="block text-gradient">Smart Analysis</span>
          </h1>
          
          <p className="text-xl text-secondary-600 dark:text-dark-600 max-w-3xl mx-auto leading-relaxed">
            Get intelligent problem recommendations, learning insights, and personalized guidance 
            to optimize your coding practice and accelerate your growth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <Link
            to="/analyze"
            className="btn-primary btn-lg flex items-center space-x-2 shadow-glow hover:shadow-glow-lg"
          >
            <FiBarChart2 className="w-5 h-5" />
            <span>Analyze Problem</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            to="/about"
            className="btn-secondary btn-lg flex items-center space-x-2"
          >
            <span>Learn More</span>
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card p-6 text-center hover-lift"
            >
              <Icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-secondary-900 dark:text-dark-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-600">
                {stat.label}
              </div>
            </div>
          );
        })}
      </motion.section>

      {/* Example Analysis Section */}
      <section className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-dark-800">
            See Our Analysis in Action
          </h2>
          <p className="text-lg text-secondary-600 dark:text-dark-600 max-w-2xl mx-auto">
            Here's how our intelligent analysis helps you make better decisions about which problems to tackle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {exampleAnalyses.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              className="space-y-6"
            >
              {/* Problem Header */}
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-dark-800">
                      {example.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      example.difficulty === 'Easy' ? 'bg-success-100 text-success-700' :
                      example.difficulty === 'Medium' ? 'bg-warning-100 text-warning-700' :
                      'bg-danger-100 text-danger-700'
                    }`}>
                      {example.difficulty}
                    </span>
                    <span className="text-sm text-secondary-600 dark:text-dark-600">
                      Problem #{example.problemNumber}
                    </span>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${example.recommendationBg}`}>
                    <example.recommendationIcon className={`w-4 h-4 ${example.recommendationColor}`} />
                    <span className={`font-medium text-sm ${example.recommendationColor}`}>
                      {example.recommendation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Analysis Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mathematical Score */}
                <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30">
                  <div className="text-center space-y-3">
                    <FiCpu className="w-8 h-8 text-blue-600 mx-auto" />
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-dark-800">
                      Mathematical Score
                    </h4>
                    <div className="text-3xl font-bold text-blue-600">
                      {example.mathematicalScore}/5.0
                    </div>
                    {renderStars(example.mathematicalScore)}
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Based on likes, acceptance rate, age & difficulty
                    </p>
                  </div>
                </div>

                {/* AI Score */}
                <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30">
                  <div className="text-center space-y-3">
                    <FiSettings className="w-8 h-8 text-purple-600 mx-auto" />
                    <h4 className="text-lg font-semibold text-secondary-900 dark:text-dark-800">
                      AI Score
                    </h4>
                    <div className="text-3xl font-bold text-purple-600">
                      {example.aiScore}/5.0
                    </div>
                    {renderStars(example.aiScore)}
                    <p className="text-sm text-purple-700 dark:text-purple-400 leading-tight">
                      {example.aiReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="card p-4 text-center">
                  <div className={`flex items-center justify-center mb-2 ${
                    example.recommendation === 'DO' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    <example.recommendationIcon className="w-5 h-5" />
                  </div>
                  <div className="text-lg font-semibold text-secondary-900 dark:text-dark-800">
                    Recommendation
                  </div>
                  <div className={`text-sm ${
                    example.recommendation === 'DO' 
                      ? 'text-success-700' 
                      : 'text-danger-700'
                  }`}>
                    {example.recommendation === 'DO' 
                      ? 'Highly recommended! Excellent problem quality.' 
                      : 'Consider skipping. Mathematical score may have issues.'
                    }
                  </div>
                </div>

                <div className="card p-4 text-center">
                  <FiClock className="w-5 h-5 text-primary-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-secondary-900 dark:text-dark-800">
                    Estimated Time
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    {example.estimatedTime}
                  </div>
                  <div className="text-xs text-secondary-600 dark:text-dark-600">
                    Based on difficulty & acceptance rate
                  </div>
                </div>

                <div className="card p-4 text-center">
                  <FiTrendingUp className="w-5 h-5 text-success-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-secondary-900 dark:text-dark-800">
                    Community Rating
                  </div>
                  <div className="text-2xl font-bold text-success-600">
                    {example.communityRating}%
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <FiThumbsUp className="w-3 h-3 text-success-600" />
                      <span>{example.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiThumbsDown className="w-3 h-3 text-danger-600" />
                      <span>{example.dislikes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-dark-800">
            Why Choose LeetCode Companion?
          </h2>
          <p className="text-lg text-secondary-600 dark:text-dark-600 max-w-2xl mx-auto">
            Our platform combines data science with practical insights to make your coding practice more efficient and effective.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="card p-8 hover-lift"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-secondary-100 dark:bg-dark-200 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-800">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-dark-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="card p-8 md:p-12 text-center space-y-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800/30"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-dark-800">
          Ready to Optimize Your Practice?
        </h2>
        <p className="text-lg text-secondary-600 dark:text-dark-600 max-w-2xl mx-auto">
          Start analyzing problems today and discover a smarter way to approach LeetCode challenges.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/analyze"
            className="btn-primary btn-lg flex items-center space-x-2"
          >
            <FiBarChart2 className="w-5 h-5" />
            <span>Get Started</span>
          </Link>
          <Link
            to="/profile"
            className="btn-secondary btn-lg flex items-center space-x-2"
          >
            <FiUsers className="w-5 h-5" />
            <span>View Profile</span>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
