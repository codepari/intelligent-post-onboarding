# Post-Onboarding Management System - Design Document

## 1. System Overview

### 1.1 Architecture Overview
The system follows a modern, lightweight architecture with:
- **Frontend**: React SPA with Material-UI
- **Backend**: Node.js/Express REST API with rule-based AI capabilities
- **Database**: SQLite for local development (PostgreSQL for production)
- **Integrations**: Google Calendar API, Google Sheets API
- **Email Service**: Nodemailer (SMTP-based)
- **Storage**: Local filesystem (S3 for production)
- **Monitoring**: Winston logging

### 1.2 Intelligent Features
The system incorporates rule-based AI capabilities:
- **Predictive Renege Detection**: Rule-based scoring model to predict candidate drop-off risk
- **Sentiment Analysis**: Basic sentiment scoring of candidate communications
- **Automated Follow-ups**: Scheduled follow-ups at 10, 15, 20 days post-joining
- **Risk Scoring**: Multi-factor risk assessment based on communication patterns
- **Google Calendar Integration**: Automated calendar event creation for follow-ups
- **Google Sheets Tracking**: Centralized tracking of all follow-up conversations

## 2. Technology Stack

### 2.1 Frontend
- **Framework**: React 18+ with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup validation
- **Charts**: Recharts / Chart.js
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Build Tool**: Vite

### 2.2 Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Email**: Nodemailer (SMTP)
- **Scheduling**: node-cron
- **File Upload**: Multer (local filesystem)
- **Google APIs**: googleapis (Calendar & Sheets)
- **Logging**: Winston + Morgan
- **Testing**: Jest + Supertest

### 2.3 Rule-Based AI System
- **Language**: TypeScript (integrated in backend)
- **Approach**: Rule-based scoring algorithms
- **Risk Factors**:
  - Days since last contact
  - Response delay patterns
  - Stage transition delays
  - Communication frequency
  - Joining date proximity
- **Sentiment Analysis**: Keyword-based scoring
- **Fallback Strategy**: Graceful degradation with default risk levels

### 2.4 Database & Storage
- **Primary DB**: SQLite (local dev), PostgreSQL (production)
- **File Storage**: Local filesystem (development), S3 (production)
- **Session Storage**: In-memory (development), Redis (production optional)
- **Google Integration**: Google Sheets for follow-up tracking

### 2.5 External Integrations
- **Google Calendar API**: Automated follow-up event scheduling
- **Google Sheets API**: Centralized follow-up tracking and status updates
- **Email**: SMTP-based email delivery (Gmail, SendGrid, or custom SMTP)
- **Optional Production Services**:
  - AWS S3 for document storage
  - AWS SES for email delivery
  - Redis for caching
  - CloudWatch for monitoring

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Web App   │  │  Mobile App  │  │   Admin UI   │       │
│  │   (React)   │  │   (Future)   │  │   (React)    │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Service                       │
│                   (Node.js/Express/TypeScript)               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ • Auth Service        • Analytics Service           │    │
│  │ • Candidate Service   • Notification Service        │    │
│  │ • Communication Svc   • Google Calendar Service     │    │
│  │ • Document Service    • Google Sheets Service       │    │
│  │ • Rule-Based AI       • Follow-up Scheduler         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
         │              │                    │
         │              │                    │
         ▼              ▼                    ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│   SQLite/    │  │   Local FS/  │  │  Google APIs     │
│  PostgreSQL  │  │   AWS S3     │  │  • Calendar      │
│  (Database)  │  │  (Storage)   │  │  • Sheets        │
└──────────────┘  └──────────────┘  └──────────────────┘
```

### 3.2 Component Architecture

#### 3.2.1 Frontend Architecture
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   ├── candidates/      # Candidate-related components
│   ├── dashboard/       # Dashboard components
│   └── communications/  # Communication components
├── features/            # Redux slices
│   ├── auth/
│   ├── candidates/
│   ├── communications/
│   └── analytics/
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services
├── utils/               # Utility functions
├── types/               # TypeScript types
└── App.tsx
```

#### 3.2.2 Backend Architecture
```
src/
├── controllers/         # Route handlers
├── services/            # Business logic
├── models/              # Prisma models
├── middleware/          # Express middleware
├── routes/              # API routes
├── utils/               # Utilities
├── jobs/                # Scheduled jobs
├── validators/          # Request validators
└── server.ts
```

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│    Users    │      │  Candidates  │      │  Documents  │
├─────────────┤      ├──────────────┤      ├─────────────┤
│ id          │◄────┐│ id           │      │ id          │
│ email       │     ││ firstName    │◄────┐│ candidateId │
│ name        │     ││ lastName     │     ││ type        │
│ role        │     ││ email        │     ││ fileName    │
│ createdAt   │     ││ phone        │     ││ s3Key       │
└─────────────┘     ││ jobTitle     │     ││ status      │
                    ││ compensation │     ││ uploadedAt  │
┌─────────────┐     ││ joiningDate  │     │└─────────────┘
│   Stages    │     ││ location     │     │
├─────────────┤     ││ workArrange  │     │┌─────────────┐
│ id          │     ││ currentStage │────┐││     BGV     │
│ name        │◄────┘│ taOwnerId    │────┘│├─────────────┤
│ order       │      │ hmOwnerId    │     ││ id          │
│ description │      │ hrOwnerId    │     ││ candidateId │
└─────────────┘      │ offerStatus  │     ││ status      │
                     │ riskScore    │◄────┤│ vendor      │
┌──────────────┐     │ createdAt    │     ││ startDate   │
│Communications│     └──────────────┘     ││ completedAt │
├──────────────┤                          │└─────────────┘
│ id           │                          │
│ candidateId  │──────────────────────────┘
│ type         │
│ subject      │      ┌─────────────┐
│ content      │      │ Escalations │
│ sentAt       │      ├─────────────┤
│ sentBy       │      │ id          │
│ status       │      │ candidateId │─────┐
│ responseAt   │      │ reason      │     │
│ sentiment    │──────┤ severity    │     │
└──────────────┘      │ assignedTo  │     │
                      │ status      │     │
┌─────────────┐       │ resolvedAt  │     │
│  Templates  │       └─────────────┘     │
├─────────────┤                            │
│ id          │       ┌─────────────┐     │
│ name        │       │   Metrics   │     │
│ type        │       ├─────────────┤     │
│ subject     │       │ id          │     │
│ body        │       │ metricType  │     │
│ region      │       │ value       │     │
│ variables   │       │ date        │     │
└─────────────┘       │ metadata    │     │
                      └─────────────┘     │
┌─────────────┐                           │
│ AIInsights  │                           │
├─────────────┤                           │
│ id          │                           │
│ candidateId │───────────────────────────┘
│ insightType │
│ score       │
│ details     │
│ generatedAt │
└─────────────┘
```

### 4.2 Core Tables Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL, -- TA, HM, HR_OPS, HRBP, ADMIN
  region VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Candidates Table
```sql
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  job_title VARCHAR(200) NOT NULL,
  compensation DECIMAL(15,2),
  currency VARCHAR(10) DEFAULT 'USD',
  joining_date DATE NOT NULL,
  offer_date DATE NOT NULL,
  acceptance_date DATE,
  acceptance_deadline DATE,
  location VARCHAR(100),
  region VARCHAR(50), -- INDIA, US, UK_EU
  work_arrangement VARCHAR(50), -- WFO, REMOTE, HYBRID
  current_stage_id UUID REFERENCES stages(id),
  ta_owner_id UUID REFERENCES users(id),
  hm_owner_id UUID REFERENCES users(id),
  hr_owner_id UUID REFERENCES users(id),
  offer_status VARCHAR(50), -- PENDING, ACCEPTED, REJECTED
  risk_score DECIMAL(5,2) DEFAULT 0, -- 0-100, AI-calculated
  risk_level VARCHAR(20), -- LOW, MEDIUM, HIGH
  last_contact_date TIMESTAMP,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Stages Table
```sql
CREATE TABLE stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  order_index INTEGER NOT NULL,
  description TEXT,
  typical_duration_days INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Communications Table
```sql
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- EMAIL, CALL, MEETING, SMS
  category VARCHAR(50), -- WELCOME, CHECK_IN, MANAGER_CONNECT, etc.
  subject VARCHAR(500),
  content TEXT,
  sent_at TIMESTAMP,
  sent_by UUID REFERENCES users(id),
  status VARCHAR(50), -- SCHEDULED, SENT, DELIVERED, FAILED, RESPONDED
  response_received_at TIMESTAMP,
  response_content TEXT,
  sentiment_score DECIMAL(5,2), -- -1 to 1, AI-calculated
  sentiment_label VARCHAR(20), -- POSITIVE, NEUTRAL, NEGATIVE
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Documents Table
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL, -- RESUME, ID_PROOF, ADDRESS_PROOF, etc.
  file_name VARCHAR(255) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(50), -- PENDING, SUBMITTED, VERIFIED, REJECTED
  uploaded_at TIMESTAMP,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### BGV (Background Verification) Table
```sql
CREATE TABLE bgv_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL, -- NOT_STARTED, INITIATED, IN_PROGRESS, COMPLETED, ISSUES
  vendor VARCHAR(100),
  initiated_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  result VARCHAR(50), -- CLEAR, DISCREPANCY, FAILED
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Escalations Table
```sql
CREATE TABLE escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  reason VARCHAR(200) NOT NULL,
  description TEXT,
  severity VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
  escalated_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  status VARCHAR(50), -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
  resolution TEXT,
  escalated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Templates Table
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- EMAIL, SMS, WHATSAPP
  category VARCHAR(50), -- WELCOME, CHECK_IN, DAY1, etc.
  subject VARCHAR(500),
  body TEXT NOT NULL,
  region VARCHAR(50),
  variables JSONB, -- Dynamic variables: {firstName}, {joiningDate}, etc.
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### AI Insights Table
```sql
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL, -- RENEGE_RISK, SENTIMENT, ENGAGEMENT, ANOMALY
  score DECIMAL(5,2),
  confidence DECIMAL(5,2),
  details JSONB,
  recommendations TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  model_version VARCHAR(50)
);
```

#### Metrics Table
```sql
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type VARCHAR(100) NOT NULL,
  metric_name VARCHAR(200) NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  region VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 Indexes
```sql
-- Performance indexes
CREATE INDEX idx_candidates_stage ON candidates(current_stage_id);
CREATE INDEX idx_candidates_joining ON candidates(joining_date);
CREATE INDEX idx_candidates_ta ON candidates(ta_owner_id);
CREATE INDEX idx_candidates_risk ON candidates(risk_score DESC);
CREATE INDEX idx_communications_candidate ON communications(candidate_id);
CREATE INDEX idx_communications_sent ON communications(sent_at);
CREATE INDEX idx_documents_candidate ON documents(candidate_id);
CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_ai_insights_candidate ON ai_insights(candidate_id, insight_type);
```

## 5. API Design

### 5.1 API Endpoints

#### Authentication
```
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
POST   /api/auth/refresh         # Refresh token
GET    /api/auth/me              # Get current user
```

#### Candidates
```
GET    /api/candidates                    # List all candidates (with filters)
POST   /api/candidates                    # Create new candidate
GET    /api/candidates/:id                # Get candidate details
PATCH  /api/candidates/:id                # Update candidate
DELETE /api/candidates/:id                # Soft delete candidate
GET    /api/candidates/:id/timeline       # Get candidate journey timeline
GET    /api/candidates/:id/risk           # Get AI risk assessment
POST   /api/candidates/:id/advance-stage  # Move to next stage
```

#### Communications
```
GET    /api/communications                     # List communications
POST   /api/communications                     # Create/log communication
GET    /api/communications/:id                 # Get communication details
PATCH  /api/communications/:id                 # Update communication
POST   /api/communications/send-email          # Send email
POST   /api/communications/bulk-send           # Bulk send emails
GET    /api/communications/upcoming            # Get upcoming scheduled comms
```

#### Documents
```
GET    /api/documents/candidate/:candidateId   # List candidate documents
POST   /api/documents/upload                   # Upload document
GET    /api/documents/:id                      # Get document details
DELETE /api/documents/:id                      # Delete document
PATCH  /api/documents/:id/verify               # Verify document
```

#### BGV
```
GET    /api/bgv/candidate/:candidateId         # Get BGV status
POST   /api/bgv                                # Initiate BGV
PATCH  /api/bgv/:id                            # Update BGV status
```

#### Escalations
```
GET    /api/escalations                        # List escalations
POST   /api/escalations                        # Create escalation
PATCH  /api/escalations/:id                    # Update escalation
POST   /api/escalations/:id/resolve            # Resolve escalation
```

#### Templates
```
GET    /api/templates                          # List templates
POST   /api/templates                          # Create template
GET    /api/templates/:id                      # Get template
PATCH  /api/templates/:id                      # Update template
DELETE /api/templates/:id                      # Delete template
POST   /api/templates/:id/preview              # Preview template with data
```

#### Analytics & Metrics
```
GET    /api/analytics/dashboard                # Dashboard metrics
GET    /api/analytics/offer-acceptance         # Offer acceptance rate
GET    /api/analytics/conversion               # Acceptance to joining conversion
GET    /api/analytics/renege-reasons           # Renege analysis
GET    /api/analytics/stage-distribution       # Candidates by stage
GET    /api/analytics/time-to-join             # Time to join metrics
```

#### AI/ML Endpoints (Integrated in Backend)
```
GET    /api/candidates/:id/risk                # Get rule-based risk assessment
POST   /api/follow-ups/candidates/:id/schedule # Schedule automated follow-ups
GET    /api/follow-ups/pending                 # Get pending follow-ups from Google Sheets
POST   /api/follow-ups/complete                # Mark follow-up as complete
GET    /api/follow-ups/tracking-sheet          # Get Google Sheet URL
```

#### Notifications
```
GET    /api/notifications                      # Get user notifications
PATCH  /api/notifications/:id/read             # Mark as read
POST   /api/notifications/preferences          # Update preferences
```

#### Users & Admin
```
GET    /api/users                              # List users (Admin)
POST   /api/users                              # Create user (Admin)
PATCH  /api/users/:id                          # Update user
GET    /api/users/:id/candidates               # Get user's candidates
```

### 5.2 Example API Request/Response

#### POST /api/candidates
**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "+1234567890",
  "jobTitle": "Senior Software Engineer",
  "compensation": 150000,
  "currency": "USD",
  "joiningDate": "2026-05-01",
  "offerDate": "2026-03-24",
  "acceptanceDeadline": "2026-03-31",
  "location": "San Francisco",
  "region": "US",
  "workArrangement": "HYBRID",
  "taOwnerId": "uuid-ta-user",
  "hmOwnerId": "uuid-hm-user",
  "hrOwnerId": "uuid-hr-user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-candidate",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "currentStage": {
      "id": "uuid-stage",
      "name": "Offer Release",
      "order": 1
    },
    "offerStatus": "PENDING",
    "riskScore": 0,
    "riskLevel": "LOW",
    "createdAt": "2026-03-24T10:00:00Z"
  }
}
```

#### GET /api/candidates/:id/risk
**Response:**
```json
{
  "success": true,
  "data": {
    "candidateId": "uuid-candidate",
    "riskScore": 72.5,
    "riskLevel": "HIGH",
    "factors": [
      {
        "factor": "Delayed responses",
        "impact": "HIGH",
        "weight": 0.35
      },
      {
        "factor": "Joining date pushed twice",
        "impact": "HIGH",
        "weight": 0.30
      },
      {
        "factor": "Negative sentiment in last communication",
        "impact": "MEDIUM",
        "weight": 0.20
      }
    ],
    "recommendations": [
      "Immediate TA connect",
      "Schedule HM intervention call",
      "Identify compensation concerns"
    ],
    "confidence": 0.85,
    "lastUpdated": "2026-03-24T10:00:00Z"
  }
}
```

## 6. Rule-Based AI Features Design

### 6.1 Renege Prediction Model

**Algorithm**: Rule-based scoring system
**Features Evaluated**:
- Days to joining (weight: 0.25)
- Response time to communications (weight: 0.20)
- Number of communications vs responses (weight: 0.15)
- Stage transition delays (weight: 0.15)
- Joining date changes count (weight: 0.15)
- Last contact days ago (weight: 0.10)

**Scoring Logic**:
```typescript
riskScore = (
  dayToJoiningScore * 0.25 +
  responseTimeScore * 0.20 +
  communicationRatioScore * 0.15 +
  stageDelayScore * 0.15 +
  joiningChangesScore * 0.15 +
  lastContactScore * 0.10
) * 100

riskLevel = riskScore >= 70 ? 'HIGH' :
            riskScore >= 40 ? 'MEDIUM' : 'LOW'
```

**Output**: Risk score (0-100), Risk level (LOW/MEDIUM/HIGH), Contributing factors

**Fallback**: If insufficient data, defaults to LOW risk with lower confidence

### 6.2 Sentiment Analysis

**Approach**: Keyword-based sentiment scoring
**Input**: Email responses, call notes, communication content
**Logic**:
- Positive keywords: "excited", "looking forward", "great", "thanks" (+1)
- Negative keywords: "concerned", "worried", "issue", "problem" (-1)
- Neutral: everything else (0)

**Output**: Sentiment score (-1 to 1), label (POSITIVE/NEUTRAL/NEGATIVE)

**Use Cases**:
- Track candidate engagement trends
- Flag negative sentiment for intervention
- Measure communication effectiveness

### 6.3 Automated Follow-ups

**Schedule**: 10, 15, 20 days after joining date
**Integration**:
- Google Calendar: Creates events for HM and TA
- Google Sheets: Tracks all scheduled follow-ups
**Status Tracking**: Pending → Completed with notes

### 6.4 Risk Factors Identification

**Factors Monitored**:
- Delayed responses (>3 days)
- Joining date changes (multiple postponements)
- Negative sentiment in communications
- Document submission delays
- Stage duration exceeding typical timeframe

**Output**: List of risk factors with impact level (HIGH/MEDIUM/LOW)

## 7. Security Architecture

### 7.1 Authentication & Authorization
- **JWT-based authentication**
- **Role-based access control (RBAC)**
- **Refresh token rotation**
- **Password hashing**: bcrypt (salt rounds: 12)

### 7.2 Data Security
- **Encryption at rest**: AWS RDS encryption
- **Encryption in transit**: TLS 1.3
- **Sensitive data**: Encrypted in application layer
- **PII handling**: Masked in logs, encrypted in DB

### 7.3 API Security
- **Rate limiting**: 100 requests/minute per user
- **CORS**: Whitelist specific domains
- **Input validation**: All inputs validated with Zod
- **SQL injection prevention**: Parameterized queries (Prisma ORM)
- **XSS prevention**: Content sanitization

### 7.4 Audit & Compliance
- **Audit logging**: All data access and modifications
- **GDPR compliance**: Right to be forgotten, data export
- **Data retention policies**: Automated cleanup
- **Access logs**: CloudWatch

## 8. Deployment Architecture

### 8.1 Local Development Environment

```
localhost:3000 (Frontend - React/Vite)
    ↓
localhost:5001 (Backend API - Node.js/Express)
    ↓
    ├─→ SQLite Database (./dev.db)
    ├─→ Local Filesystem (./uploads)
    ├─→ Google Calendar API
    └─→ Google Sheets API
```

### 8.2 Production Environment (Optional AWS Deployment)

```
Route 53 (DNS)
    ↓
CloudFront (CDN) → S3 (Static Frontend)
    ↓
Application Load Balancer
    ↓
ECS Fargate / EC2 (Backend API)
    ↓
    ├─→ RDS PostgreSQL
    ├─→ S3 (Document storage)
    ├─→ SES (Email service)
    ├─→ Google Calendar API
    └─→ Google Sheets API
```

### 8.3 Environment Configuration
- **Development**:
  - Single process
  - SQLite database
  - Local file storage
  - SMTP email (optional)

- **Production** (if deployed):
  - Auto-scaling instances
  - PostgreSQL database
  - S3 storage
  - AWS SES email
  - CloudWatch monitoring

## 9. Performance Optimization

### 9.1 Backend Optimization
- **Database**:
  - Indexed frequently queried fields
  - Connection pooling via Prisma
  - Efficient queries with Prisma query builder
  - Pagination for large datasets (50 items/page)

### 9.2 API Optimization
- **Response compression**: gzip enabled
- **Efficient data fetching**: Only load required fields
- **Lazy loading**: Pagination on candidate lists
- **Error handling**: Graceful degradation for external services

### 9.3 Frontend Optimization
- **Code splitting**: React lazy loading
- **Memoization**: React.memo for expensive components
- **Virtual scrolling**: For long lists
- **Debouncing**: Search inputs

## 10. Monitoring & Observability

### 10.1 Metrics to Track
- **API**: Response time, error rate, request count
- **Database**: Query time, connection count
- **Google APIs**: API call success/failure rates
- **Business**: Candidate counts, risk distribution, follow-up completion rates

### 10.2 Logging
- **Application logs**: Winston (JSON format)
- **Access logs**: Morgan (HTTP requests)
- **Console output**: Development environment
- **File logging**: Production environment

### 10.3 Error Handling
- **Graceful degradation**: Google API failures don't break app
- **User-friendly messages**: Clear error communication
- **Retry logic**: For transient failures
- **Fallback mechanisms**: Rule-based AI when ML unavailable

## 11. Testing Strategy

### 11.1 Backend Testing
- **Unit tests**: Jest (>80% coverage)
- **Integration tests**: Supertest
- **API tests**: Postman collections
- **Load tests**: Artillery (1000 concurrent users)

### 11.2 Frontend Testing
- **Unit tests**: Jest + React Testing Library
- **Component tests**: Storybook
- **E2E tests**: Cypress (critical user flows)

### 11.3 System Testing
- **Integration tests**: Google API integration
- **E2E flows**: Complete candidate journey
- **Performance**: Load testing with realistic data

## 12. Migration & Rollout Plan

### Phase 1 (Month 1): Core Features
- User management & authentication
- Candidate CRUD operations
- Basic stage management
- Email templates & sending

### Phase 2 (Month 2): Advanced Features
- Communication tracking
- Document management
- BGV tracking
- Dashboard & analytics

### Phase 3 (Month 3): AI & Automation Features
- Rule-based renege prediction
- Sentiment analysis
- Automated follow-up scheduling (10, 15, 20 days)
- Google Calendar integration
- Google Sheets tracking

### Phase 4 (Ongoing): Enhancements
- Mobile app
- ATS integration
- WhatsApp/SMS
- Advanced reporting

## 13. Risk Mitigation

### 13.1 Technical Risks
- **Risk**: Google API rate limits or permission issues
  - **Mitigation**: Error handling, graceful degradation, retry logic

- **Risk**: Email deliverability problems
  - **Mitigation**: Use reputable SMTP service, monitor bounce rates

- **Risk**: SQLite limitations at scale
  - **Mitigation**: Easy migration path to PostgreSQL for production

### 13.2 Business Risks
- **Risk**: Low user adoption
  - **Mitigation**: User training, intuitive UI, gradual rollout

- **Risk**: Data privacy concerns
  - **Mitigation**: GDPR compliance, transparent policies

## 14. Future Enhancements

### 14.1 Machine Learning Enhancements
- **ML-based prediction**: Upgrade to scikit-learn/TensorFlow models
- **Deep learning NLP**: Advanced sentiment analysis with transformers
- **Conversational AI**: Chatbot for candidate queries
- **Predictive analytics**: Forecast hiring pipeline trends

### 14.2 Integration
- **ATS systems**: Greenhouse, Lever, Workday
- **HRMS**: BambooHR, Workday
- **Communication**: Slack, Microsoft Teams

### 14.3 Infrastructure Enhancements
- **Message Queue**: Add SQS/RabbitMQ for async processing
- **Caching Layer**: Redis for performance optimization
- **CDN**: CloudFront for global distribution
- **Monitoring**: CloudWatch, Prometheus, Grafana dashboards

## 15. Appendix

### 15.1 Technology Justification

**Why React?**
- Large ecosystem, excellent performance
- Strong typing with TypeScript
- Great developer experience

**Why Node.js?**
- JavaScript full-stack consistency
- Excellent async I/O for API services
- Rich npm ecosystem

**Why SQLite?**
- Zero configuration for development
- File-based, no server needed
- Easy migration to PostgreSQL for production
- Sufficient for MVP and small deployments

**Why Rule-Based AI?**
- Immediate value without ML infrastructure
- Transparent and explainable decisions
- No training data required initially
- Easy to tune and adjust
- Clear upgrade path to ML models

### 15.2 References
- AWS Well-Architected Framework
- OWASP Top 10 Security Guidelines
- React Best Practices
- PostgreSQL Performance Tuning Guide
- ML Model Deployment Best Practices
