# LeetCode Companion Backend

A comprehensive backend API for the LeetCode Companion Platform that provides problem analysis, user profile integration, and intelligent recommendations.

## Features

- **Problem Analysis**: Get detailed problem information with intelligent recommendations
- **User Integration**: Fetch user profiles, solved problems, and statistics
- **Smart Recommendations**: AI-powered suggestions based on community feedback
- **Caching**: Efficient caching system for improved performance
- **Rate Limiting**: Built-in protection against API abuse

## API Endpoints

### Problem Routes (`/api/problems`)
- `GET /details/:identifier` - Get problem details by ID or title slug
- `GET /list` - Get paginated list of problems with filtering
- `GET /daily` - Get today's daily problem
- `GET /search` - Search problems by title

### User Routes (`/api/users`)
- `GET /profile/:username` - Get user profile information
- `GET /solved/:username` - Get user's solved problems
- `GET /submissions/:username` - Get user's recent submissions
- `GET /contest/:username` - Get user's contest information
- `GET /language-stats/:username` - Get user's programming language statistics
- `GET /skill-stats/:username` - Get user's skill statistics

### Analysis Routes (`/api/analysis`)
- `POST /analyze` - Analyze a problem and get recommendations
- `GET /similar/:problemId` - Find similar problems based on topics

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `LEETCODE_API_BASE` - LeetCode API base URL

## API Usage Examples

### Analyze a Problem
```bash
curl -X POST http://localhost:5000/api/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{"problemId": "1", "username": "your_username"}'
```

### Get Problem Details
```bash
curl http://localhost:5000/api/problems/details/two-sum
```

### Get User Profile
```bash
curl http://localhost:5000/api/users/profile/username
```

## Response Format

All API responses follow a consistent format:
- Success responses return the requested data
- Error responses include an `error` field with description
- Cached responses include appropriate cache headers

## Rate Limiting

- 100 requests per 15 minutes per IP
- Cached responses don't count against rate limits
- Rate limit headers included in responses

## Caching

- 10-minute TTL for most endpoints
- 1-hour TTL for daily problems
- Cache keys include relevant parameters for proper invalidation
