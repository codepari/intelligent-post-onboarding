# Quick Start Guide

## ✅ Setup Complete!

Both backend and frontend dependencies are installed. Now let's get the database set up and run the application.

## Prerequisites Check

- ✅ Node.js installed
- ✅ Backend dependencies installed (533 packages)
- ✅ Frontend dependencies installed (334 packages)
- ✅ `.env` file created
- ⏳ Docker Desktop (needs to be started)

## Step-by-Step Instructions

### 1. Start Docker Desktop

**Manual step required:**
1. Open **Docker Desktop** application from your Applications folder
2. Wait until Docker is running (whale icon in menu bar is stable)
3. This usually takes 30-60 seconds

### 2. Set Up Database (Automated Script)

Once Docker is running, from the `backend` directory, run:

```bash
./setup.sh
```

This script will:
- Start PostgreSQL container
- Run database migrations
- Seed with sample data

**OR do it manually:**

```bash
# Start PostgreSQL
docker run --name postgres-onboarding \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=post_onboarding \
  -p 5432:5432 \
  -d postgres:15

# Wait 5 seconds for PostgreSQL to initialize
sleep 5

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run seed
```

### 3. Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
Server running on port 5000
Environment: development
Scheduled jobs initialized successfully
```

**Test backend:** Open http://localhost:5000/health

### 4. Start Frontend (New Terminal)

Open a **new terminal** and run:

```bash
cd /Users/i300314/git/onboarding/frontend
npm run dev
```

**Expected output:**
```
VITE v5.1.0  ready in 500 ms
➜  Local:   http://localhost:3000/
```

### 5. Access the Application

Open your browser to: **http://localhost:3000**

## Login Credentials

### Default Users (all password: `password123`)

| Role | Email | Description |
|------|-------|-------------|
| **TA** | `ta@company.com` | Talent Acquisition user (recommended for testing) |
| **Admin** | `admin@company.com` | Administrator with full access |
| **HM** | `hm@company.com` | Hiring Manager |
| **HR** | `hr@company.com` | HR Operations |

## What You'll See

### Dashboard
- **Total Candidates**: 3
- **At Risk Candidates**: Showing risk distribution
- **AI Insights Panel**: Intelligent recommendations
- **Charts**: Risk level distribution pie chart

### Candidates List
3 sample candidates with different profiles:

1. **John Doe** (Senior Software Engineer)
   - Risk Level: LOW (15%)
   - Stage: Pre-Joining Engagement
   - Region: US

2. **Jane Smith** (Product Manager)
   - Risk Level: MEDIUM (45%)
   - Stage: Documentation & BGV
   - Region: India

3. **Alex Brown** (Data Scientist)
   - Risk Level: HIGH (72%)
   - Stage: Offer Acceptance
   - Region: UK/EU

### Test AI Risk Assessment

1. Click on **Alex Brown** (high risk candidate)
2. View the **AI Risk Assessment** section on the right
3. You'll see:
   - Risk Score: 72%
   - Risk Level: HIGH
   - Risk Factors breakdown
   - AI-powered recommendations
   - Confidence level: 75%

## Features to Explore

### 1. Intelligent Risk Scoring
- Navigate to any candidate details page
- View real-time AI risk assessment
- See risk factors and recommended actions

### 2. Communication Tracking
- View communication history for each candidate
- See sentiment analysis (Positive/Neutral/Negative)
- Track response times

### 3. Dashboard Analytics
- Monitor candidates by stage
- Track risk distribution
- View upcoming joinings

### 4. Scheduled Jobs
The system runs automated jobs in the background:
- **Daily (2 AM)**: Update risk scores for all candidates
- **Hourly**: Check for overdue communications
- **Daily (9 AM)**: Send joining reminders

## Troubleshooting

### "Cannot connect to Docker"
- Make sure Docker Desktop is running
- Check the whale icon in your menu bar
- Wait until it's stable (not animating)

### "Port 5432 already in use"
- Another PostgreSQL instance is running
- Either stop it or change the port in `.env`

### "Port 5000 already in use"
```bash
# Find process on port 5000
lsof -ti:5000

# Kill it
kill -9 <PID>
```

### "Migration failed"
```bash
# Reset database
docker stop postgres-onboarding
docker rm postgres-onboarding

# Run setup script again
./setup.sh
```

## Stopping the Application

### Stop Backend
Press `Ctrl+C` in the backend terminal

### Stop Frontend
Press `Ctrl+C` in the frontend terminal

### Stop Docker PostgreSQL
```bash
docker stop postgres-onboarding
```

### Restart PostgreSQL Later
```bash
docker start postgres-onboarding
```

## Next Steps

1. ✅ Explore the dashboard
2. ✅ View candidate details and AI risk assessments
3. ✅ Test filtering and search
4. ✅ Review the AI recommendations
5. ✅ Check out the documentation:
   - `../REQUIREMENTS.md` - Full requirements
   - `../DESIGN.md` - System architecture
   - `../LOCAL_SETUP.md` - Detailed setup guide

## Database Tools

### Prisma Studio (Database GUI)
View and edit your database visually:

```bash
npm run studio
```

Opens at: http://localhost:5555

### Reset Database
```bash
npx prisma migrate reset
npm run seed
```

## Support

For issues, refer to:
1. `LOCAL_SETUP.md` - Comprehensive troubleshooting
2. Check backend logs in `backend/logs/`
3. Check browser console for frontend errors

---

**🎉 Enjoy exploring the Intelligent Post-Onboarding Management System!**
