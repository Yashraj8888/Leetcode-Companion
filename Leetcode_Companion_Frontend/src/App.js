import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import ProblemAnalysis from './pages/ProblemAnalysis';
import UserProfile from './pages/UserProfile';
import About from './pages/About';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Check for saved username
    const savedUsername = localStorage.getItem('leetcode_username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername);
    if (newUsername) {
      localStorage.setItem('leetcode_username', newUsername);
    } else {
      localStorage.removeItem('leetcode_username');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-secondary-50 dark:bg-dark-50 transition-colors duration-300">
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          username={username}
          onUsernameChange={handleUsernameChange}
        />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/analyze" 
              element={<ProblemAnalysis username={username} />} 
            />
            <Route 
              path="/profile" 
              element={<UserProfile username={username} />} 
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        
        <Footer />
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#27272a' : '#ffffff',
              color: darkMode ? '#e4e4e7' : '#1e293b',
              border: `1px solid ${darkMode ? '#3f3f46' : '#e2e8f0'}`,
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
