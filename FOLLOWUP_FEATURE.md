# Follow-up Scheduling & Tracking Feature - Quick Start

## What Was Added

I've implemented a complete follow-up scheduling and tracking system that:

1. **Blocks calendars** for Hiring Managers and TA Owners at 10, 15, and 20 days after a candidate joins
2. **Creates a Google Sheet** to track all follow-up conversations
3. **Allows marking follow-ups as completed** with notes from the UI

## Features Available Now (Without Google Setup)

Even without Google Calendar/Sheets configured, you can:
- View the Follow-ups page in the navigation
- Click "Schedule Follow-ups" button on candidate detail pages
- The backend will log the scheduling attempts

## To Enable Full Functionality

You need to configure Google Calendar and Sheets integration. This requires:

### Quick Setup (5 minutes)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Enable APIs**:
   - Google Calendar API
   - Google Sheets API
3. **Create a Service Account**:
   - IAM & Admin > Service Accounts > Create
   - Download the JSON key
4. **Add to your `.env` file**:
   ```bash
   GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...paste entire JSON here..."}'
   ```
5. **Restart the backend server**

For detailed instructions, see: `/Users/i300314/git/onboarding/GOOGLE_INTEGRATION_SETUP.md`

## Current Status

### ✅ Backend Implementation
- `google.service.ts` - Google Calendar & Sheets integration service
- `followUp.controller.ts` - API controllers for scheduling and tracking
- `followUp.routes.ts` - REST API endpoints
- Routes registered in the main server

### ✅ Frontend Implementation
- `FollowUps.tsx` - Page to view and manage pending follow-ups
- Updated `CandidateDetails.tsx` - Added "Schedule Follow-ups" button
- Updated `App.tsx` - Added Follow-ups route
- Updated `Layout.tsx` - Added Follow-ups to navigation menu

### ✅ API Endpoints
- `POST /api/follow-ups/candidates/:id/schedule` - Schedule follow-ups for a candidate
- `GET /api/follow-ups/pending` - Get all pending follow-ups
- `POST /api/follow-ups/complete` - Mark a follow-up as completed
- `GET /api/follow-ups/tracking-sheet` - Get Google Sheet URL

## How It Works

### 1. Schedule Follow-ups
When you click "Schedule Follow-ups" on a candidate's detail page:
- Creates 6 calendar events (3 for HM, 3 for TA)
- Events are scheduled at 10, 15, and 20 days after joining
- Each event is 30 minutes at 10:00 AM
- Reminders: 1 day before (email) and 30 minutes before (popup)

### 2. Track in Google Sheet
Simultaneously adds 6 rows to a Google Sheet:
- Candidate Name
- Follow-up Date
- Days Since Joining (10, 15, or 20)
- Assigned To (HM or TA email)
- Status (Pending)
- Notes (empty initially)
- Last Updated (timestamp)

### 3. Complete Follow-ups
From the Follow-ups page:
- View all pending follow-ups
- Click checkmark to mark as completed
- Add notes about the conversation
- Updates the Google Sheet automatically

## Testing Without Google Setup

The system gracefully handles missing Google configuration:
- Backend logs warnings: "Google Calendar not configured - skipping..."
- Frontend shows: "Failed to load follow-ups. Google Sheets may not be configured."
- Core candidate management features continue to work normally

## Testing With Google Setup

Once configured:

1. **Schedule follow-ups**:
   ```bash
   # Go to a candidate detail page
   # Click "Schedule Follow-ups"
   # Check success message
   ```

2. **Verify Calendar**:
   - Open Google Calendar
   - Look for events titled "Follow-up: [Candidate Name] (Day 10/15/20)"

3. **Verify Sheet**:
   - Go to Follow-ups page
   - Click "Open Google Sheet"
   - See all scheduled follow-ups

4. **Complete follow-up**:
   - Click checkmark icon
   - Add notes
   - Click "Mark as Completed"
   - Verify sheet updates

## Environment Variables

Add to `/Users/i300314/git/onboarding/backend/.env`:

```bash
# Google Calendar & Sheets Integration
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"service-account@project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token",...}'

# Optional: Leave blank to auto-create sheet
GOOGLE_TRACKING_SHEET_ID=
```

## What You Can Do Now

1. **Navigate to Follow-ups page** - See the new menu item in the sidebar
2. **Open any candidate detail page** - See the "Schedule Follow-ups" button
3. **Set up Google integration** - Follow the guide in `GOOGLE_INTEGRATION_SETUP.md`
4. **Test the feature** - Schedule follow-ups for a candidate and track them

## Files Modified/Created

### Backend
- ✅ Created: `src/services/google.service.ts`
- ✅ Created: `src/controllers/followUp.controller.ts`
- ✅ Created: `src/routes/followUp.routes.ts`
- ✅ Modified: `src/routes/index.ts` (added follow-up routes)
- ✅ Modified: `.env.example` (added Google config)
- ✅ Installed: `googleapis` and `google-auth-library` packages

### Frontend
- ✅ Created: `src/pages/FollowUps.tsx`
- ✅ Modified: `src/pages/CandidateDetails.tsx` (added schedule button)
- ✅ Modified: `src/App.tsx` (added route)
- ✅ Modified: `src/components/layout/Layout.tsx` (added menu item)

### Documentation
- ✅ Created: `GOOGLE_INTEGRATION_SETUP.md` (complete setup guide)
- ✅ Created: `FOLLOWUP_FEATURE.md` (this file)

## Next Steps

1. **Set up Google Cloud project** (5 minutes)
2. **Configure service account** (3 minutes)
3. **Add credentials to .env** (1 minute)
4. **Restart backend** (10 seconds)
5. **Test the feature** (2 minutes)

Total setup time: ~11 minutes

## Support

- Google setup issues: See `GOOGLE_INTEGRATION_SETUP.md`
- Backend errors: Check logs with `cd backend && npm run dev`
- Frontend errors: Check browser console
