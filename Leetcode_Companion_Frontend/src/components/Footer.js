import React from 'react';
import { FiGithub, FiHeart, FiCode } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-100 border-t border-secondary-200 dark:border-dark-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-600 rounded-lg">
                <FiCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">LeetCode Companion</span>
            </div>
            <p className="text-secondary-600 dark:text-dark-600 text-sm">
              Intelligent problem analysis and personalized recommendations to enhance your coding journey.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-secondary-900 dark:text-dark-800">Features</h3>
            <ul className="space-y-2 text-sm text-secondary-600 dark:text-dark-600">
              <li>• Smart problem recommendations</li>
              <li>• Learning outcome analysis</li>
              <li>• Solving time estimation</li>
              <li>• User progress tracking</li>
              <li>• Similar problem suggestions</li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-secondary-900 dark:text-dark-800">Resources</h3>
            <div className="space-y-2">
              <a
                href="https://leetcode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-secondary-600 dark:text-dark-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                LeetCode Platform
              </a>
              <a
                href="https://github.com/alfaarghya/alfa-leetcode-api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm text-secondary-600 dark:text-dark-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <FiGithub className="w-4 h-4" />
                <span>API Source</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-200 dark:border-dark-200 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-secondary-600 dark:text-dark-600">
              © 2024 LeetCode Companion. Built for the coding community.
            </p>
            <div className="flex items-center space-x-1 text-sm text-secondary-600 dark:text-dark-600">
              <span>Made with</span>
              <FiHeart className="w-4 h-4 text-red-500" />
              <span>for developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
