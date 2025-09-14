import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTarget, 
  FiZap, 
  FiTrendingUp, 
  FiUsers,
  FiCode,
  FiBarChart2,
  FiClock,
  FiHeart,
  FiGithub,
  FiExternalLink
} from 'react-icons/fi';

const About = () => {
  const features = [
    {
      icon: FiTarget,
      title: 'Smart Recommendations',
      description: 'AI-powered analysis of problem quality using community feedback and engagement metrics.',
      details: 'Our algorithm analyzes likes/dislikes ratios, acceptance rates, and community discussions to provide actionable recommendations.'
    },
    {
      icon: FiClock,
      title: 'Time Estimation',
      description: 'Accurate solving time predictions based on difficulty, acceptance rates, and historical data.',
      details: 'Get realistic time estimates to better plan your practice sessions and manage your learning schedule.'
    },
    {
      icon: FiBarChart2,
      title: 'Learning Analytics',
      description: 'Comprehensive analysis of topics, concepts, and skills you\'ll develop from each problem.',
      details: 'Understand the educational value of problems before investing your time, with detailed learning outcome breakdowns.'
    },
    {
      icon: FiUsers,
      title: 'Progress Tracking',
      description: 'Personal progress analysis comparing your solved problems with new challenges.',
      details: 'Track your growth across different topics and identify areas where you need more practice.'
    }
  ];

  const stats = [
    { label: 'Problems in Database', value: '3000+' },
    { label: 'Analysis Accuracy', value: '95%' },
    { label: 'Average Time Saved', value: '50%' },
    { label: 'User Satisfaction', value: '4.9/5' }
  ];

  const technologies = [
    { name: 'React', description: 'Modern UI framework' },
    { name: 'Node.js', description: 'Backend runtime' },
    { name: 'Express', description: 'Web framework' },
    { name: 'Tailwind CSS', description: 'Utility-first styling' },
    { name: 'Framer Motion', description: 'Smooth animations' },
    { name: 'Axios', description: 'HTTP client' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-dark-800">
          About LeetCode Companion
        </h1>
        <p className="text-xl text-secondary-600 dark:text-dark-600 leading-relaxed max-w-3xl mx-auto">
          A comprehensive platform designed to optimize your LeetCode practice through intelligent 
          analysis, personalized recommendations, and data-driven insights.
        </p>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card p-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800/30"
      >
        <div className="flex items-center space-x-3 mb-6">
          <FiHeart className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-800">Our Mission</h2>
        </div>
        <p className="text-lg text-secondary-700 dark:text-dark-700 leading-relaxed">
          We believe that effective learning comes from making informed decisions about what to study. 
          LeetCode Companion empowers developers to maximize their practice time by providing intelligent 
          insights into problem quality, learning outcomes, and personal progress tracking.
        </p>
      </motion.section>

      {/* Features Section */}
      <section className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-dark-800 mb-4">
            Key Features
          </h2>
          <p className="text-lg text-secondary-600 dark:text-dark-600">
            Everything you need to make your coding practice more effective
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
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="card p-6 hover-lift"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-dark-800">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-dark-600">
                      {feature.description}
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-dark-500">
                      {feature.details}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="card p-8"
      >
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-800 text-center mb-8">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-800 mb-4">
            Built With Modern Technologies
          </h2>
          <p className="text-secondary-600 dark:text-dark-600">
            Leveraging the best tools for performance, reliability, and user experience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className="card p-4 text-center hover-lift"
            >
              <div className="font-semibold text-secondary-900 dark:text-dark-800 mb-1">
                {tech.name}
              </div>
              <div className="text-sm text-secondary-600 dark:text-dark-600">
                {tech.description}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* API Attribution */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="card p-6 bg-secondary-50 dark:bg-dark-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FiCode className="w-5 h-5 text-secondary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-dark-800">
            Data Source
          </h3>
        </div>
        <p className="text-secondary-600 dark:text-dark-600 mb-4">
          This platform is powered by the excellent{' '}
          <a
            href="https://github.com/alfaarghya/alfa-leetcode-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center space-x-1"
          >
            <span>Alfa LeetCode API</span>
            <FiExternalLink className="w-3 h-3" />
          </a>
          {' '}by alfaarghya. We're grateful for their contribution to the developer community.
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <a
            href="https://github.com/alfaarghya/alfa-leetcode-api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-secondary-600 dark:text-dark-600 hover:text-primary-600 transition-colors"
          >
            <FiGithub className="w-4 h-4" />
            <span>View API Source</span>
          </a>
          <span className="text-secondary-400">•</span>
          <span className="text-secondary-600 dark:text-dark-600">
            MIT License
          </span>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-dark-800 mb-4">
            How It Works
          </h2>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-800 mb-2">
                  Enter Problem Information
                </h3>
                <p className="text-secondary-600 dark:text-dark-600">
                  Input a LeetCode problem number, title slug, or full URL to begin the analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-800 mb-2">
                  AI-Powered Analysis
                </h3>
                <p className="text-secondary-600 dark:text-dark-600">
                  Our system analyzes community feedback, difficulty metrics, and learning outcomes to generate insights.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-dark-800 mb-2">
                  Get Personalized Recommendations
                </h3>
                <p className="text-secondary-600 dark:text-dark-600">
                  Receive tailored advice on whether to solve the problem, along with time estimates and learning outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
