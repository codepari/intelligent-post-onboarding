# Google Calendar & Sheets Integration Setup

## Overview

The post-onboarding system automatically schedules follow-up conversations with candidates at **10, 15, and 20 days** after their joining date. These follow-ups are tracked in Google Calendar and Google Sheets.

## Features

1. **Automatic Calendar Blocking**: Creates calendar events for Hiring Managers and TA Owners at 10, 15, and 20 days after candidate joining
2. **Google Sheets Tracking**: Maintains a centralized tracking sheet with all scheduled follow-ups
3. **Status Management**: Mark conversations as completed and add notes directly from the UI

## Setup Instructions

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Calendar API
   - Google Sheets API

### Step 2: Create a Service Account

1. Navigate to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name it: `post-onboarding-service`
4. Click **Create and Continue**
5. Grant the following roles:
   - **Editor** (or create a custom role with Calendar and Sheets access)
6. Click **Continue** and then **Done**

### Step 3: Create Service Account Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Choose **JSON** format
5. Download the JSON key file (keep it secure!)

### Step 4: Configure Backend Environment

1. Open your backend `.env` file
2. Add the Google service account credentials:

```bash
# Copy the entire contents of your downloaded JSON key file
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"post-onboarding-service@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'

# Optional: Provide an existing sheet ID, or leave blank to auto-create
GOOGLE_TRACKING_SHEET_ID=
```

**Important**: Make sure to escape the private key properly in the JSON. The newlines should be `\\n`.

### Step 5: Share Calendar Access

For the service account to create calendar events for users:

1. Each user (HM, TA) must share their calendar with the service account email
2. Go to Google Calendar settings
3. Find the calendar you want to share
4. Under "Share with specific people", add the service account email:
   ```
   post-onboarding-service@your-project.iam.gserviceaccount.com
   ```
5. Grant **"Make changes to events"** permission

### Step 6: Create or Share Tracking Sheet

**Option A: Auto-create (Recommended)**

The system will automatically create a tracking sheet on first use. The sheet URL will be available in the Follow-ups page.

**Option B: Use existing sheet**

1. Create a Google Sheet manually
2. Share it with the service account email (Editor access)
3. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
4. Add it to `.env`:
   ```bash
   GOOGLE_TRACKING_SHEET_ID=your-sheet-id-here
   ```

## Usage

### Scheduling Follow-ups

1. Navigate to a candidate's detail page
2. Click **"Schedule Follow-ups"** button
3. The system will:
   - Create 6 calendar events (3 for HM, 3 for TA) at days 10, 15, 20
   - Add 6 rows to the tracking sheet with status "Pending"

### Tracking Follow-ups

1. Navigate to **Follow-ups** page in the sidebar
2. View all pending follow-ups
3. Click the checkmark icon to mark a follow-up as completed
4. Add notes about the conversation
5. Click **"Open Google Sheet"** to view the full tracking sheet

### Google Sheet Columns

| Column | Description |
|--------|-------------|
| Candidate Name | Full name of the candidate |
| Follow-up Date | Scheduled date for follow-up |
| Days Since Joining | 10, 15, or 20 |
| Assigned To | Email of HM or TA |
| Status | Pending or Completed |
| Notes | Conversation notes |
| Last Updated | Timestamp of last update |

## Calendar Event Details

Each calendar event includes:
- **Summary**: "Follow-up: [Candidate Name] (Day X)"
- **Description**: Context about the post-onboarding check-in
- **Duration**: 30 minutes
- **Time**: 10:00 AM UTC (configurable in code)
- **Reminders**:
  - Email reminder 1 day before
  - Popup reminder 30 minutes before

## Troubleshooting

### Calendar events not appearing

1. Verify the service account has access to the user's calendar
2. Check that the `GOOGLE_SERVICE_ACCOUNT_KEY` is properly formatted
3. Ensure Google Calendar API is enabled in your project

### Sheet not updating

1. Verify the service account has Editor access to the sheet
2. Check that Google Sheets API is enabled
3. Review backend logs for specific error messages

### "Google not configured" message

This means the `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable is not set or is invalid. The system will continue to work but without calendar/sheets integration.

## Security Best Practices

1. **Never commit the service account key to version control**
2. Store the key securely using a secrets manager (AWS Secrets Manager, Google Secret Manager, etc.)
3. Rotate the service account keys periodically
4. Use least-privilege access - only grant necessary permissions
5. Monitor service account usage in Google Cloud Console

## API Endpoints

### Schedule Follow-ups
```
POST /api/follow-ups/candidates/:id/schedule
Authorization: Bearer <token>
```

### Get Pending Follow-ups
```
GET /api/follow-ups/pending
Authorization: Bearer <token>
```

### Complete Follow-up
```
POST /api/follow-ups/complete
Content-Type: application/json
Authorization: Bearer <token>

{
  "candidateName": "John Doe",
  "followUpDate": "2026-04-03",
  "assignedTo": "manager@company.com",
  "notes": "Had a great conversation. Candidate is settling in well."
}
```

### Get Tracking Sheet URL
```
GET /api/follow-ups/tracking-sheet
Authorization: Bearer <token>
```

## Customization

### Change Follow-up Intervals

Edit `/backend/src/services/google.service.ts`:

```typescript
const intervals = [10, 15, 20]; // Change to [7, 14, 21] for weekly intervals
```

### Change Meeting Time

Edit `/backend/src/services/google.service.ts`:

```typescript
startTime.setHours(10, 0, 0); // Change to 14, 0, 0 for 2:00 PM
```

### Change Meeting Duration

Edit `/backend/src/services/google.service.ts`:

```typescript
duration: 30 // Change to 45 for 45-minute meetings
```

## Testing

To test the integration without scheduling real events:

1. Use a test Google account
2. Create a test calendar and sheet
3. Schedule follow-ups for a test candidate
4. Verify events appear in the test calendar
5. Verify rows appear in the test sheet
6. Mark a follow-up as completed
7. Verify the sheet updates

## Support

For issues with:
- **Google Calendar/Sheets APIs**: Check [Google Workspace documentation](https://developers.google.com/workspace)
- **Service Account setup**: Review [Google Cloud IAM docs](https://cloud.google.com/iam/docs/service-accounts)
- **Application issues**: Check backend logs and review error messages
