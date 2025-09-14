import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiSun, 
  FiMoon, 
  FiCode, 
  FiUser, 
  FiHome, 
  FiBarChart2,
  FiMenu,
  FiX
} from 'react-icons/fi';

const Header = ({ darkMode, toggleDarkMode, username, onUsernameChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'Analyze', href: '/analyze', icon: FiBarChart2 },
    { name: 'Profile', href: '/profile', icon: FiUser },
  ];

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    onUsernameChange(tempUsername.trim());
    setIsUsernameModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-100/80 backdrop-blur-md border-b border-secondary-200 dark:border-dark-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition-colors">
                <FiCode className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient">LeetCode Companion</h1>
                <p className="text-xs text-secondary-600 dark:text-dark-600">Smart Problem Analysis</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-secondary-700 dark:text-dark-700 hover:bg-secondary-100 dark:hover:bg-dark-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Username Display/Set */}
              <button
                onClick={() => setIsUsernameModalOpen(true)}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-secondary-100 dark:bg-dark-200 rounded-lg hover:bg-secondary-200 dark:hover:bg-dark-300 transition-colors"
              >
                <FiUser className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {username || 'Set Username'}
                </span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-secondary-100 dark:bg-dark-200 hover:bg-secondary-200 dark:hover:bg-dark-300 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FiSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FiMoon className="w-5 h-5 text-secondary-600" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-secondary-100 dark:bg-dark-200 hover:bg-secondary-200 dark:hover:bg-dark-300 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden py-4 border-t border-secondary-200 dark:border-dark-200"
            >
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'text-secondary-700 dark:text-dark-700 hover:bg-secondary-100 dark:hover:bg-dark-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile Username Button */}
                <button
                  onClick={() => {
                    setIsUsernameModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-secondary-700 dark:text-dark-700 hover:bg-secondary-100 dark:hover:bg-dark-200 transition-colors"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="font-medium">
                    {username ? `User: ${username}` : 'Set Username'}
                  </span>
                </button>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Username Modal */}
      {isUsernameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-dark-100 rounded-xl shadow-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4 text-secondary-900 dark:text-dark-800">
              Set LeetCode Username
            </h3>
            <form onSubmit={handleUsernameSubmit}>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter your LeetCode username"
                className="input mb-4"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary btn-md flex-1"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUsernameModalOpen(false);
                    setTempUsername(username);
                  }}
                  className="btn-secondary btn-md flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
            <p className="text-xs text-secondary-600 dark:text-dark-600 mt-3">
              This will be used to analyze your solved problems and provide personalized recommendations.
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Header;
