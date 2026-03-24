# Post-Onboarding Management System - Local Setup Guide

## Overview

This guide will help you set up and run the Intelligent Post-Onboarding Management System locally with both backend and frontend connected.

## System Architecture

- **Backend**: Node.js/Express with TypeScript, PostgreSQL, Redis (optional)
- **Frontend**: React with TypeScript, Material-UI, Redux Toolkit
- **AI Features**: Rule-based with ML service integration capability

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
1. **Node.js** (v20.x or later)
   ```bash
   node --version  # Should be v20.x or higher
   ```

2. **PostgreSQL** (v15 or later)
   ```bash
   psql --version  # Should be 15.x or higher
   ```

3. **npm** or **yarn** (npm comes with Node.js)
   ```bash
   npm --version
   ```

4. **Git** (for cloning the repository)
   ```bash
   git --version
   ```

### Optional Software
5. **Redis** (v7 or later) - For caching (optional but recommended)
   ```bash
   redis-server --version
   ```

6. **Docker** (optional) - For running PostgreSQL/Redis in containers
   ```bash
   docker --version
   ```

## Setup Instructions

### Step 1: Clone or Navigate to the Project

```bash
cd /Users/i300314/git/onboarding
```

You should see two directories:
- `backend/` - Node.js API server
- `frontend/` - React application

### Step 2: Set Up PostgreSQL Database

#### Option A: Using Local PostgreSQL

1. **Create a new database:**
   ```bash
   psql postgres
   ```

   In psql shell:
   ```sql
   CREATE DATABASE post_onboarding;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE post_onboarding TO postgres;
   \q
   ```

#### Option B: Using Docker

```bash
docker run --name postgres-onboarding \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=post_onboarding \
  -p 5432:5432 \
  -d postgres:15
```

### Step 3: Set Up Redis (Optional but Recommended)

#### Option A: Using Local Redis

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from https://redis.io/download
```

#### Option B: Using Docker

```bash
docker run --name redis-onboarding \
  -p 6379:6379 \
  -d redis:7
```

### Step 4: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your configuration:**
   ```bash
   # Open in your preferred editor
   nano .env
   # or
   vim .env
   # or
   code .env
   ```

   Minimum required configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://postgres:password@localhost:5432/post_onboarding?schema=public
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
   FRONTEND_URL=http://localhost:3000
   ```

5. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

   This will create:
   - 6 workflow stages
   - 4 users (admin, TA, HM, HR)
   - 3 sample candidates
   - Email templates

7. **Start the backend server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server running on port 5000
   Environment: development
   Scheduled jobs initialized successfully
   ```

8. **Verify backend is running:**
   Open browser and go to: http://localhost:5000/health

   You should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-03-24T..."
   }
   ```

### Step 5: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.1.0  ready in 500 ms

   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Step 6: Login to the Application

Use one of the following demo credentials:

#### Admin User
- **Email**: `admin@company.com`
- **Password**: `password123`

#### TA (Talent Acquisition) User
- **Email**: `ta@company.com`
- **Password**: `password123`

#### Hiring Manager User
- **Email**: `hm@company.com`
- **Password**: `password123`

#### HR Operations User
- **Email**: `hr@company.com`
- **Password**: `password123`

## Running Both Backend and Frontend Together

### Using Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd /Users/i300314/git/onboarding/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/i300314/git/onboarding/frontend
npm run dev
```

### Using tmux (Advanced)

```bash
# Start tmux session
tmux new -s onboarding

# Split window horizontally
Ctrl+b %

# In left pane (backend)
cd /Users/i300314/git/onboarding/backend
npm run dev

# Switch to right pane
Ctrl+b →

# In right pane (frontend)
cd /Users/i300314/git/onboarding/frontend
npm run dev

# Detach from tmux: Ctrl+b d
# Reattach: tmux attach -t onboarding
```

## Testing the Application

### 1. Dashboard
- Navigate to http://localhost:3000
- You should see the dashboard with:
  - Total candidates count
  - At-risk candidates
  - Upcoming joinings
  - Risk level distribution pie chart
  - AI insights

### 2. Candidates List
- Click on "Candidates" in the sidebar
- You should see a table with 3 sample candidates:
  - John Doe (Senior Software Engineer)
  - Jane Smith (Product Manager)
  - Alex Brown (Data Scientist)

### 3. Candidate Details
- Click the eye icon on any candidate
- You should see:
  - Full candidate information
  - Communication history
  - AI risk assessment with:
    - Risk score (0-100)
    - Risk level (LOW/MEDIUM/HIGH/CRITICAL)
    - Risk factors
    - Recommended actions

### 4. Test AI Risk Assessment
- The system automatically calculates risk scores based on:
  - Days to joining
  - Communication response times
  - Days since last contact
  - Document submission status
  - Active escalations

## Troubleshooting

### Backend Issues

#### Issue: "Error: connect ECONNREFUSED ::1:5432"
**Solution**: PostgreSQL is not running
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Docker
docker start postgres-onboarding
```

#### Issue: "Prisma Client not found"
**Solution**: Generate Prisma client
```bash
cd backend
npx prisma generate
```

#### Issue: "Port 5000 already in use"
**Solution**: Change port in `.env` file or kill the process
```bash
# Find process on port 5000
lsof -ti:5000

# Kill the process
kill -9 <PID>
```

### Frontend Issues

#### Issue: "Cannot connect to backend"
**Solution**: Ensure backend is running on port 5000
```bash
# Check if backend is running
curl http://localhost:5000/health
```

#### Issue: "Port 3000 already in use"
**Solution**: Vite will automatically suggest next available port (3001, 3002, etc.)

### Database Issues

#### Issue: "Database does not exist"
**Solution**: Create the database
```bash
psql postgres -c "CREATE DATABASE post_onboarding;"
```

#### Issue: "Migration failed"
**Solution**: Reset database and re-run migrations
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npm run seed
```

## Accessing Prisma Studio (Database GUI)

Prisma Studio provides a visual interface to view and edit your database:

```bash
cd backend
npm run studio
```

This will open Prisma Studio at http://localhost:5555

## API Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ta@company.com","password":"password123"}'
```

### Get Candidates (with token)
```bash
TOKEN="<your-access-token>"
curl http://localhost:5000/api/candidates \
  -H "Authorization: Bearer $TOKEN"
```

### Get Risk Assessment
```bash
curl http://localhost:5000/api/candidates/<candidate-id>/risk \
  -H "Authorization: Bearer $TOKEN"
```

## Project Structure

```
onboarding/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/          # Business logic (including AI service)
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, error handling, upload
│   │   ├── jobs/              # Scheduled jobs (risk scoring, reminders)
│   │   ├── utils/             # Logger, Prisma client
│   │   ├── config/            # Configuration
│   │   └── server.ts          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── features/          # Redux slices
│   │   ├── services/          # API client
│   │   ├── hooks/             # Custom hooks
│   │   ├── store/             # Redux store
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
├── REQUIREMENTS.md
├── DESIGN.md
└── README.md
```

## Key Features to Test

### 1. Intelligent Risk Scoring
- Navigate to any candidate details page
- View the AI risk assessment section
- The system uses a rule-based algorithm that considers:
  - Time until joining date
  - Communication responsiveness
  - Silence periods
  - Sentiment analysis
  - Document submission status
  - Active escalations

### 2. Scheduled Jobs
The backend runs scheduled jobs that:
- Update risk scores daily at 2 AM
- Check for overdue communications every hour
- Send joining reminders at 9 AM daily

### 3. Communication Tracking
- View communication history for each candidate
- Track sentiment of communications
- Monitor response times

## Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- **Backend**: Changes to `.ts` files automatically restart the server
- **Frontend**: Changes to `.tsx` files update in browser instantly

### Debugging Backend
```bash
# Enable debug logs
NODE_ENV=development npm run dev
```

### Debugging Frontend
Open browser DevTools:
- Console: View logs and errors
- Network: Inspect API calls
- Redux DevTools: Install extension to inspect Redux state

## Stopping the Application

### Backend
Press `Ctrl+C` in the backend terminal

### Frontend
Press `Ctrl+C` in the frontend terminal

### Cleanup (if using Docker)
```bash
docker stop postgres-onboarding redis-onboarding
docker rm postgres-onboarding redis-onboarding
```

## Next Steps

1. **Explore the Application**: Navigate through all pages and features
2. **Add a New Candidate**: Use Prisma Studio or API to add candidates
3. **Test Risk Scoring**: Modify candidate data and see risk scores update
4. **Review Logs**: Check `backend/logs/` for application logs
5. **Read Documentation**: Review REQUIREMENTS.md and DESIGN.md for details

## Additional Resources

- **Backend API Documentation**: Check the routes in `backend/src/routes/`
- **Database Schema**: View `backend/prisma/schema.prisma`
- **AI Service Logic**: Check `backend/src/services/ai.service.ts`
- **Frontend State Management**: Review Redux slices in `frontend/src/features/`

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review application logs in `backend/logs/`
3. Check browser console for frontend errors
4. Verify all services (PostgreSQL, Redis, Backend, Frontend) are running

## Performance Note

On first load, the application might take a few seconds to:
- Connect to the database
- Initialize scheduled jobs
- Load initial data

Subsequent requests will be faster due to caching and connection pooling.

---

**You're all set! The intelligent post-onboarding management system is now running locally.**

Access the application at: **http://localhost:3000**
