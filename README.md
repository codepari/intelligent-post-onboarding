# 🚀 Intelligent Post-Onboarding Management System

> An AI-powered platform to manage candidate onboarding, track engagement, predict reneging risks, and automate follow-up conversations.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## 🎯 Overview

The Intelligent Post-Onboarding Management System streamlines the post-offer acceptance phase of recruitment. It helps HR teams, Talent Acquisition (TA) specialists, and Hiring Managers (HM) track candidates, predict reneging risks, and maintain engagement through automated follow-ups.

### Problem Statement

After a candidate accepts an offer, there's a critical window where they might receive competing offers, change their mind, or lose engagement. This system addresses these challenges through AI-powered risk prediction, automated follow-up scheduling, and centralized tracking.

## ✨ Key Features

### 🤖 AI-Powered Risk Assessment
- Rule-based risk scoring analyzing 6+ factors
- Real-time risk classification (LOW/MEDIUM/HIGH/CRITICAL)
- Predictive analytics based on communication, documents, and stage progression

### 📅 Automated Follow-up Management
- Calendar blocking for HM and TA at 10, 15, 20 days post-joining
- Google Calendar integration with automatic event creation
- Google Sheets tracking for conversation notes
- Status management and reminder notifications

### 📊 Analytics & Reporting
- Real-time dashboard with metrics
- Risk distribution visualization
- Offer acceptance rate tracking
- CSV export with filtering support

### 🔐 Role-Based Access Control
- Admin, TA Owner, Hiring Manager, HR Owner roles
- Granular permissions for each role

## 🛠 Tech Stack

**Backend**: Node.js, Express, TypeScript, SQLite, Prisma  
**Frontend**: React 18, TypeScript, Material-UI, Redux Toolkit  
**Integrations**: Google Calendar API, Google Sheets API

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone repository
git clone https://github.com/codepari/intelligent-post-onboarding.git
cd intelligent-post-onboarding

# Set up backend
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Set up frontend
cd ../frontend
npm install

# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

Access at: http://localhost:3000

**Default login**: admin@example.com / admin123

## 📚 Documentation

- [QUICK_START.md](QUICK_START.md) - Get running in 5 minutes
- [REQUIREMENTS.md](REQUIREMENTS.md) - Complete requirements
- [DESIGN.md](DESIGN.md) - Architecture and design
- [GOOGLE_INTEGRATION_SETUP.md](GOOGLE_INTEGRATION_SETUP.md) - Calendar/Sheets setup
- [LOCAL_SETUP.md](LOCAL_SETUP.md) - Detailed setup guide

## 📸 Screenshots

See `/docs/screenshots/` for application screenshots.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

## 📄 License

MIT License - See LICENSE file

---

**Built with ❤️ for better candidate experience**
