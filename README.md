# LeetCode Companion Platform

A comprehensive web platform that provides intelligent analysis and recommendations for LeetCode problems, helping developers optimize their coding practice through data-driven insights and AI-powered recommendations.

## 🚀 Features

### Core Functionality
- **Dual Rating System**: 
  - **Mathematical Score**: Algorithm-based rating using likes, acceptance rate, problem age, difficulty, and tag importance (1-5 stars)
  - **AI Score**: Gemini AI-powered analysis with contextual reasoning and educational value assessment (1-5 stars)
- **Smart Recommendations**: Combined mathematical and AI analysis to suggest whether to solve, practice, or skip problems
- **Learning Outcomes**: Detailed breakdown of topics and concepts you'll learn from each problem
- **Time Estimation**: Accurate solving time predictions based on difficulty and acceptance rates
- **Problem Statistics**: Comprehensive metrics including difficulty, likes, dislikes, submissions, and acceptance rates
- **User Progress Tracking**: Compare your solved problems with new challenges to track learning progress
- **Database Integration**: PostgreSQL database for efficient data storage and retrieval, reducing API calls

### Additional Features
- **Similar Problem Suggestions**: Find related problems based on topic tags
- **User Profile Integration**: View your LeetCode statistics, language preferences, and skill breakdowns
- **Responsive Design**: Beautiful, modern UI optimized for all devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Real-time Analysis**: Fast problem analysis with intelligent caching

## 🏗️ Architecture

### Backend (Node.js + Express + PostgreSQL)
- RESTful API with comprehensive endpoints
- PostgreSQL database for efficient data storage and caching
- Integration with [Alfa LeetCode API](https://github.com/alfaarghya/alfa-leetcode-api)
- Gemini AI integration for intelligent problem analysis
- Mathematical rating algorithm with weighted scoring
- Data synchronization service for periodic API updates
- Intelligent caching system for improved performance
- Rate limiting and security middleware
- Error handling and logging

### Frontend (React + Tailwind CSS)
- Modern React 18 application
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Real-time notifications
- Progressive Web App features

## 📁 Project Structure

```
LeetCode_Companion/
├── LeetCode_Companion_Backend/     # Express.js backend
│   ├── routes/                     # API route handlers
│   │   ├── problemRoutes.js       # Problem-related endpoints
│   │   ├── userRoutes.js          # User profile endpoints
│   │   └── analysisRoutes.js      # Analysis and recommendation logic
│   ├── server.js                  # Main server file
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment variables
├── Leetcode_Companion_Frontend/   # React frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   ├── App.js                 # Main app component
│   │   └── index.css              # Global styles
│   ├── public/                    # Static assets
│   └── package.json               # Frontend dependencies
└── README.md                      # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL (v12 or higher)
- Gemini API key (free from Google AI Studio)

### Backend Setup
1. Navigate to the backend directory:
```bash
cd LeetCode_Companion_Backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database:
```bash
# Create a new database named 'leetcode_companion'
createdb leetcode_companion
```

4. Configure environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your configuration:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=leetcode_companion
# DB_USER=postgres
# DB_PASSWORD=your_password
# GEMINI_API_KEY=your_gemini_api_key
```

5. Start the backend server:
```bash
npm run dev  # Development mode with auto-reload
# or
npm start    # Production mode
```

The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd Leetcode_Companion_Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔧 API Endpoints

### Problem Analysis
- `POST /api/analysis/analyze` - Analyze a problem and get recommendations
- `GET /api/analysis/similar/:problemId` - Find similar problems

### Problem Information
- `GET /api/problems/details/:identifier` - Get problem details
- `GET /api/problems/list` - Get paginated problems list
- `GET /api/problems/daily` - Get daily problem
- `GET /api/problems/search` - Search problems

### User Profile
- `GET /api/users/profile/:username` - Get user profile
- `GET /api/users/solved/:username` - Get solved problems
- `GET /api/users/submissions/:username` - Get recent submissions
- `GET /api/users/language-stats/:username` - Get language statistics
- `GET /api/users/skill-stats/:username` - Get skill statistics

## 💡 How It Works

### Problem Recommendation Algorithm
1. **Community Feedback Analysis**: Analyzes likes/dislikes ratio to gauge problem quality
2. **Difficulty Assessment**: Considers acceptance rates and difficulty levels
3. **Learning Value**: Evaluates educational topics and concepts covered
4. **Personalization**: Compares with user's solved problems for personalized insights

### Recommendation Categories
- **DO** (70%+ positive feedback): Highly recommended problems with excellent community reception
- **OK** (40-70% positive feedback): Decent problems worth solving with moderate community approval
- **PASS** (<40% positive feedback): Problems with issues that might not be worth your time

### Time Estimation Formula
- **Easy**: 15-35 minutes (based on acceptance rate)
- **Medium**: 30-75 minutes (based on acceptance rate)
- **Hard**: 60-150 minutes (based on acceptance rate)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface optimized for developers
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Eye-friendly dark theme for extended coding sessions
- **Smooth Animations**: Polished interactions using Framer Motion
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance**: Optimized loading with intelligent caching and lazy loading

## 🔒 Security & Performance

- **Rate Limiting**: Prevents API abuse with configurable limits
- **CORS Protection**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive validation for all user inputs
- **Caching Strategy**: Multi-layer caching for optimal performance
- **Error Handling**: Graceful error handling with user-friendly messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Alfa LeetCode API](https://github.com/alfaarghya/alfa-leetcode-api) by alfaarghya for providing the comprehensive LeetCode data API
- The LeetCode community for creating an amazing platform for coding practice
- All contributors who help improve this project

## 📞 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ for the coding community**
