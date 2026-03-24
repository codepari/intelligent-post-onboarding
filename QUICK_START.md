# Quick Start Guide - 5 Minutes to Running

Get the Intelligent Post-Onboarding Management System up and running in just 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need 20.x or higher)
node --version

# Check npm version (need 9.x or higher)
npm --version
```

If you don't have Node.js installed, download from: https://nodejs.org/

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/codepari/intelligent-post-onboarding.git
cd intelligent-post-onboarding

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Database Setup (1 minute)

```bash
cd ../backend

# Copy environment file
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev

# Seed with sample data
npx prisma db seed
```

**What this creates:**
- ✅ SQLite database file at `backend/dev.db`
- ✅ 3 sample candidates
- ✅ 5 onboarding stages
- ✅ 4 test users (admin, TA, HM, HR)

## Step 3: Start the Application (1 minute)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5001
Environment: development
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## Step 4: Access the Application (30 seconds)

Open your browser to: **http://localhost:3000**

**Login with:**
- Email: `admin@example.com`
- Password: `admin123`

## Step 5: Explore Features (1 minute)

### Try these workflows:

1. **View Dashboard**
   - See total candidates
   - Check risk distribution
   - View upcoming joinings

2. **Browse Candidates**
   - Click "Candidates" in sidebar
   - See 3 sample candidates
   - Try filters and search

3. **Export CSV**
   - Click "Export CSV" button
   - Downloads candidate data

4. **View Candidate Details**
   - Click eye icon on any candidate
   - See full profile with risk assessment

5. **Schedule Follow-ups** (requires Google setup)
   - Click "Schedule Follow-ups" button
   - Creates calendar events

## 🎉 You're Done!

The application is now running. Here's what you can do next:

### Immediate Actions
- ✅ Explore the dashboard
- ✅ View candidate profiles
- ✅ Export data to CSV
- ✅ Check analytics

### Optional Setup
- 📅 [Set up Google Calendar & Sheets](GOOGLE_INTEGRATION_SETUP.md) for follow-up features
- 🚀 [Deploy to AWS](DEPLOYMENT.md) for production use
- 📧 Configure email notifications
- 🔐 Set up OAuth for SSO

## Test Users

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@example.com | admin123 | Full access |
| TA Owner | ta@company.com | ta123 | Candidate management |
| Hiring Manager | hm@company.com | hm123 | View assigned candidates |
| HR Owner | hr@company.com | hr123 | Document access |

## Sample Data

The system includes:

**3 Candidates:**
- John Doe (Joining: April 23, 2026)
- Jane Smith (Joining: May 8, 2026)
- Alex Brown (Joining: May 23, 2026)

**5 Stages:**
1. Offer Accepted
2. Document Collection
3. Background Verification
4. Pre-boarding
5. Day 1 Onboarding

## Common Issues

### Port already in use

```bash
# If port 5001 is busy, change in backend/.env:
PORT=5002

# If port 3000 is busy, start frontend with:
npm run dev -- --port 3001
```

### Database not created

```bash
cd backend
rm -f dev.db  # Remove old database
npx prisma migrate dev  # Recreate
npx prisma db seed  # Reseed
```

### Google Sheets error

This is normal! Google integration is optional. To enable:
- Follow [GOOGLE_INTEGRATION_SETUP.md](GOOGLE_INTEGRATION_SETUP.md)
- Or continue without it - core features still work

## Next Steps

Now that you're running, check out:

1. **[REQUIREMENTS.md](REQUIREMENTS.md)** - Understand what the system does
2. **[DESIGN.md](DESIGN.md)** - Learn the architecture
3. **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Detailed setup guide
4. **[GOOGLE_INTEGRATION_SETUP.md](GOOGLE_INTEGRATION_SETUP.md)** - Enable calendar features

## Need Help?

- **Documentation**: Check the `/docs` folder
- **Issues**: Open a GitHub issue
- **Logs**: Check terminal output for errors

## Stop the Application

```bash
# In each terminal, press:
Ctrl + C

# The database file persists, so your data is saved!
```

---

**Total time**: ~5 minutes 🎯
**Ready to use**: Yes! ✅
**Production ready**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)
