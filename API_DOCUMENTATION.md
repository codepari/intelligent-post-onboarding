# API Documentation

Complete REST API reference for the Intelligent Post-Onboarding Management System.

## Base URL

```
Development: http://localhost:5001/api
Production: https://your-domain.com/api
```

## Authentication

All endpoints except `/auth/login` and `/auth/register` require JWT authentication.

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    }
  }
}
```

### Using the Token

Include the JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints

### Candidates

#### List Candidates

```http
GET /candidates?page=1&limit=20&riskLevel=HIGH&region=US&search=john
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `riskLevel` (string): Filter by risk level (LOW/MEDIUM/HIGH/CRITICAL)
- `region` (string): Filter by region (US/INDIA/UK_EU)
- `search` (string): Search by name or email
- `stage` (string): Filter by stage ID
- `taOwnerId` (string): Filter by TA owner ID

**Response:**
```json
{
  "success": true,
  "data": {
    "candidates": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

#### Get Candidate by ID

```http
GET /candidates/:id
Authorization: Bearer <token>
```

#### Create Candidate

```http
POST /candidates
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "jobTitle": "Software Engineer",
  "joiningDate": "2026-06-01",
  "offerDate": "2026-04-15",
  "compensation": 120000,
  "currency": "USD",
  "region": "US",
  "taOwnerId": "uuid",
  "hmOwnerId": "uuid"
}
```

#### Update Candidate

```http
PATCH /candidates/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "riskLevel": "MEDIUM",
  "notes": "Candidate showed interest in competitor offer"
}
```

#### Export to CSV

```http
GET /candidates/export/csv?riskLevel=HIGH&region=US
Authorization: Bearer <token>
```

Downloads a CSV file with all filtered candidates.

#### Get Risk Assessment

```http
GET /candidates/:id/risk
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "riskScore": 65,
    "riskLevel": "MEDIUM",
    "factors": {
      "daysUntilJoining": 15,
      "communicationGap": 3,
      "documentsPending": 2,
      "escalationsCount": 0
    },
    "recommendations": [
      "Schedule follow-up call",
      "Expedite document collection"
    ]
  }
}
```

### Follow-ups

#### Schedule Follow-ups

```http
POST /follow-ups/candidates/:id/schedule
Authorization: Bearer <token>
```

Creates 6 calendar events and tracking records (3 for HM, 3 for TA at 10, 15, 20 days).

**Response:**
```json
{
  "success": true,
  "message": "Follow-ups scheduled successfully",
  "data": {
    "candidateName": "John Doe",
    "intervals": [10, 15, 20],
    "joiningDate": "2026-06-01"
  }
}
```

#### Get Pending Follow-ups

```http
GET /follow-ups/pending
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "candidateName": "John Doe",
      "followUpDate": "2026-06-11",
      "daysSinceJoining": 10,
      "assignedTo": "hm@company.com",
      "status": "Pending",
      "notes": ""
    }
  ]
}
```

#### Complete Follow-up

```http
POST /follow-ups/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "candidateName": "John Doe",
  "followUpDate": "2026-06-11",
  "assignedTo": "hm@company.com",
  "notes": "Had a great conversation. Candidate is settling in well."
}
```

#### Get Tracking Sheet URL

```http
GET /follow-ups/tracking-sheet
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sheetId": "1abc...",
    "url": "https://docs.google.com/spreadsheets/d/1abc..."
  }
}
```

### Analytics

#### Get Dashboard Metrics

```http
GET /analytics/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCandidates": 50,
    "candidatesByStage": [...],
    "candidatesByRisk": [...],
    "upcomingJoinings": 5,
    "atRiskCandidates": 3
  }
}
```

#### Get Offer Acceptance Rate

```http
GET /analytics/offer-acceptance
Authorization: Bearer <token>
```

#### Get Conversion Rate

```http
GET /analytics/conversion
Authorization: Bearer <token>
```

### Communications

#### List Communications

```http
GET /communications?candidateId=uuid
Authorization: Bearer <token>
```

#### Create Communication

```http
POST /communications
Authorization: Bearer <token>
Content-Type: application/json

{
  "candidateId": "uuid",
  "type": "EMAIL",
  "subject": "Welcome to the team!",
  "content": "We're excited...",
  "sentAt": "2026-04-15T10:00:00Z"
}
```

### Documents

#### List Documents

```http
GET /documents?candidateId=uuid
Authorization: Bearer <token>
```

#### Upload Document

```http
POST /documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "candidateId": "uuid",
  "type": "ID_PROOF",
  "file": <binary>
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per minute per IP
- Returns `429 Too Many Requests` when exceeded

## Pagination

All list endpoints support pagination:

```http
GET /candidates?page=2&limit=50
```

Response includes pagination metadata:

```json
{
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

## Filtering

Most endpoints support filtering via query parameters:

```http
GET /candidates?riskLevel=HIGH&region=US&search=john
```

## Sorting

Use `orderBy` parameter:

```http
GET /candidates?orderBy=joiningDate:asc
```

## Field Selection

Use `select` parameter:

```http
GET /candidates?select=firstName,lastName,email
```

## Response Format

All successful responses follow this structure:

```json
{
  "success": true,
  "data": { ... }
}
```

Or for lists:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": { ... }
  }
}
```

## Webhooks

Configure webhooks for events:

- `candidate.created`
- `candidate.risk_changed`
- `followup.scheduled`
- `followup.completed`

See [WEBHOOKS.md](WEBHOOKS.md) for details.

---

**API Version**: 1.0.0
**Last Updated**: March 24, 2026
