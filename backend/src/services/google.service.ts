import { google } from 'googleapis';
import { addDays, format } from 'date-fns';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/spreadsheets'
];

// For production, use OAuth2 or service account
// This is a placeholder for the authentication setup
const getAuthClient = () => {
  // In production, load credentials from environment or secure storage
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
    : null;

  if (!credentials) {
    console.warn('Google service account credentials not configured');
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return auth;
};

interface FollowUpSchedule {
  candidateId: string;
  candidateName: string;
  joiningDate: string;
  hmEmail?: string;
  taEmail?: string;
}

interface ConversationRecord {
  candidateName: string;
  followUpDate: string;
  daysSinceJoining: number;
  assignedTo: string;
  status: 'Pending' | 'Completed';
  notes: string;
}

export const googleService = {
  /**
   * Schedule calendar events for HM and TA at 10, 15, 20 days after joining
   */
  async scheduleFollowUpCalendars(schedule: FollowUpSchedule): Promise<void> {
    const auth = getAuthClient();
    if (!auth) {
      console.log('Google Calendar not configured - skipping calendar events');
      return;
    }

    try {
      const calendar = google.calendar({ version: 'v3', auth });
      const joiningDate = new Date(schedule.joiningDate);
      const intervals = [10, 15, 20];

      for (const days of intervals) {
        const followUpDate = addDays(joiningDate, days);

        // Create event for Hiring Manager (without attendees to avoid permission issues)
        if (schedule.hmEmail) {
          await this.createCalendarEvent(calendar, {
            summary: `Follow-up: ${schedule.candidateName} (Day ${days})`,
            description: `Post-onboarding check-in with ${schedule.candidateName}\n\nAssigned to: ${schedule.hmEmail}\n\nThis is a scheduled follow-up ${days} days after their joining date.`,
            start: followUpDate,
            attendees: [], // Empty to avoid Domain-Wide Delegation requirement
            duration: 30 // 30 minutes
          });
        }

        // Create event for TA Owner (without attendees)
        if (schedule.taEmail) {
          await this.createCalendarEvent(calendar, {
            summary: `Follow-up: ${schedule.candidateName} (Day ${days})`,
            description: `Post-onboarding check-in with ${schedule.candidateName}\n\nAssigned to: ${schedule.taEmail}\n\nThis is a scheduled follow-up ${days} days after their joining date.`,
            start: followUpDate,
            attendees: [], // Empty to avoid Domain-Wide Delegation requirement
            duration: 30
          });
        }
      }

      console.log('Calendar events created successfully (Note: Attendees must manually add these to their calendars)');
    } catch (error) {
      console.warn('Calendar event creation failed, continuing with sheets tracking:', error.message);
      // Don't throw - allow sheets tracking to continue
    }
  },

  async createCalendarEvent(calendar: any, event: {
    summary: string;
    description: string;
    start: Date;
    attendees: string[];
    duration: number;
  }): Promise<void> {
    try {
      const startTime = new Date(event.start);
      startTime.setHours(10, 0, 0); // Set to 10 AM

      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + event.duration);

      await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: event.summary,
          description: event.description,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'UTC',
          },
          attendees: event.attendees.map(email => ({ email })),
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 }, // 1 day before
              { method: 'popup', minutes: 30 }, // 30 minutes before
            ],
          },
        },
      });

      console.log(`Calendar event created: ${event.summary}`);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  },

  /**
   * Create or get Google Sheet for tracking conversations
   */
  async getOrCreateTrackingSheet(): Promise<string> {
    const auth = getAuthClient();
    if (!auth) {
      console.log('Google Sheets not configured');
      return '';
    }

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const sheetId = process.env.GOOGLE_TRACKING_SHEET_ID;

      if (sheetId) {
        return sheetId;
      }

      // Create new sheet
      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: 'Post-Onboarding Follow-up Tracker',
          },
          sheets: [
            {
              properties: {
                title: 'Follow-ups',
              },
            },
          ],
        },
      });

      const newSheetId = response.data.spreadsheetId || '';

      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: newSheetId,
        range: 'Follow-ups!A1:G1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [
            [
              'Candidate Name',
              'Follow-up Date',
              'Days Since Joining',
              'Assigned To',
              'Status',
              'Notes',
              'Last Updated'
            ],
          ],
        },
      });

      console.log(`Created tracking sheet: ${newSheetId}`);
      return newSheetId;
    } catch (error) {
      console.warn('Failed to create/access Google Sheet (permission denied):', error.message);
      return '';
    }
  },

  /**
   * Add follow-up records to Google Sheet
   */
  async addFollowUpRecords(
    candidateName: string,
    joiningDate: string,
    hmEmail?: string,
    taEmail?: string
  ): Promise<void> {
    const auth = getAuthClient();
    if (!auth) {
      console.log('Google Sheets not configured - skipping sheet update');
      return;
    }

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const sheetId = await this.getOrCreateTrackingSheet();

      if (!sheetId) {
        console.log('No tracking sheet available');
        return;
      }

      const intervals = [10, 15, 20];
      const joiningDateObj = new Date(joiningDate);
      const records: any[] = [];

      for (const days of intervals) {
        const followUpDate = addDays(joiningDateObj, days);

        // Add record for HM
        if (hmEmail) {
          records.push([
            candidateName,
            format(followUpDate, 'yyyy-MM-dd'),
            days.toString(),
            hmEmail,
            'Pending',
            '',
            new Date().toISOString()
          ]);
        }

        // Add record for TA
        if (taEmail) {
          records.push([
            candidateName,
            format(followUpDate, 'yyyy-MM-dd'),
            days.toString(),
            taEmail,
            'Pending',
            '',
            new Date().toISOString()
          ]);
        }
      }

      if (records.length > 0) {
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: 'Follow-ups!A:G',
          valueInputOption: 'RAW',
          requestBody: {
            values: records,
          },
        });

        console.log(`Added ${records.length} follow-up records to tracking sheet`);
      }
    } catch (error) {
      console.warn('Google Sheets tracking failed (service account may need Google Sheets API enabled and permissions):', error.message);
      // Don't throw - allow operation to succeed even without sheets tracking
    }
  },

  /**
   * Update follow-up status in Google Sheet
   */
  async updateFollowUpStatus(
    candidateName: string,
    followUpDate: string,
    assignedTo: string,
    status: 'Pending' | 'Completed',
    notes: string
  ): Promise<void> {
    const auth = getAuthClient();
    if (!auth) {
      console.log('Google Sheets not configured');
      return;
    }

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const sheetId = await this.getOrCreateTrackingSheet();

      if (!sheetId) {
        return;
      }

      // Get all rows to find the matching one
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Follow-ups!A:G',
      });

      const rows = response.data.values || [];

      for (let i = 1; i < rows.length; i++) { // Start at 1 to skip header
        const row = rows[i];
        if (
          row[0] === candidateName &&
          row[1] === followUpDate &&
          row[3] === assignedTo
        ) {
          // Update this row
          const rowNumber = i + 1;
          await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `Follow-ups!E${rowNumber}:G${rowNumber}`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [[status, notes, new Date().toISOString()]],
            },
          });

          console.log(`Updated follow-up status for ${candidateName}`);
          break;
        }
      }
    } catch (error) {
      console.warn('Failed to update follow-up status in Google Sheets:', error.message);
    }
  },

  /**
   * Get pending follow-ups from Google Sheet
   */
  async getPendingFollowUps(): Promise<ConversationRecord[]> {
    const auth = getAuthClient();
    if (!auth) {
      return [];
    }

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const sheetId = await this.getOrCreateTrackingSheet();

      if (!sheetId) {
        return [];
      }

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Follow-ups!A:G',
      });

      const rows = response.data.values || [];
      const records: ConversationRecord[] = [];

      for (let i = 1; i < rows.length; i++) { // Skip header
        const row = rows[i];
        if (row[4] === 'Pending') { // Status column
          records.push({
            candidateName: row[0],
            followUpDate: row[1],
            daysSinceJoining: parseInt(row[2]),
            assignedTo: row[3],
            status: row[4],
            notes: row[5] || '',
          });
        }
      }

      return records;
    } catch (error) {
      console.warn('Failed to fetch pending follow-ups from Google Sheets:', error.message);
      return [];
    }
  }
};
