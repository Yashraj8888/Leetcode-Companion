# LeetCode Companion Frontend

A modern, responsive React application for intelligent LeetCode problem analysis and recommendations.

## Features

- **Smart Problem Analysis**: Get AI-powered recommendations on whether to solve problems
- **Learning Insights**: Discover topics and concepts you'll learn from each problem
- **Time Estimation**: Know how long problems might take to solve
- **User Profile Integration**: Track your progress and compare with similar problems
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   └── Footer.js       # Site footer
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── ProblemAnalysis.js  # Problem analysis page
│   ├── UserProfile.js  # User profile dashboard
│   └── About.js        # About page
├── App.js              # Main app component
├── index.js            # Entry point
└── index.css           # Global styles

```

## Key Features

### Problem Analysis
- Enter problem number, title slug, or full URL
- Get intelligent recommendations (DO/OK/PASS)
- View estimated solving time
- See community feedback and statistics
- Discover learning outcomes and topics

### User Profile
- View your LeetCode statistics
- Track problems solved by difficulty
- See language and skill breakdowns
- Monitor your progress over time

### Responsive Design
- Mobile-first approach
- Beautiful animations and transitions
- Dark mode support
- Accessible UI components

## Configuration

The app uses a proxy configuration to connect to the backend API running on port 5000. Make sure the backend server is running before starting the frontend.

## Environment Variables

No environment variables are required for the frontend. The app uses the proxy configuration in package.json to connect to the backend.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
