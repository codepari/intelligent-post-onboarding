# Post-Onboarding Management System - Design Document

## 1. System Overview

### 1.1 Architecture Overview
The system follows a modern, cloud-native, microservices-inspired architecture with:
- **Frontend**: React SPA with Material-UI
- **Backend**: Node.js/Express REST API with AI/ML capabilities
- **Database**: PostgreSQL for relational data, Redis for caching
- **AI/ML Layer**: Python-based ML service for intelligent features
- **Message Queue**: AWS SQS for async processing
- **Email Service**: AWS SES for email delivery
- **Storage**: AWS S3 for document storage
- **Monitoring**: CloudWatch, Prometheus

### 1.2 Intelligent Features
The system incorporates AI/ML capabilities:
- **Predictive Renege Detection**: ML model to predict candidate drop-off risk
- **Sentiment Analysis**: NLP analysis of candidate communications
- **Smart Scheduling**: AI-powered optimal communication timing
- **Automated Follow-ups**: Context-aware automated reminders
- **Anomaly Detection**: Identify unusual patterns in candidate behavior
- **Recommendation Engine**: Suggest best engagement strategies

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
- **Email**: Nodemailer + AWS SES
- **Scheduling**: node-cron
- **File Upload**: Multer + AWS S3
- **Logging**: Winston + Morgan
- **Testing**: Jest + Supertest

### 2.3 AI/ML Service
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **ML Libraries**:
  - scikit-learn (classification models)
  - TensorFlow/Keras (deep learning)
  - spaCy / Transformers (NLP)
  - pandas, numpy (data processing)
- **Model Serving**: TensorFlow Serving / MLflow

### 2.4 Database & Caching
- **Primary DB**: PostgreSQL 15+
- **Caching**: Redis 7+
- **Search**: PostgreSQL Full-Text Search (or ElasticSearch for advanced)

### 2.5 Infrastructure (AWS)
- **Compute**: ECS Fargate / EC2
- **Load Balancer**: Application Load Balancer
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis
- **Storage**: S3
- **Queue**: SQS
- **Email**: SES
- **Monitoring**: CloudWatch, X-Ray
- **CDN**: CloudFront
- **DNS**: Route 53
- **Secrets**: Secrets Manager
- **CI/CD**: CodePipeline / GitHub Actions

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
│                      API Gateway / ALB                       │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌───────────────────────────┐  ┌──────────────────────┐
│    Backend API Service    │  │   ML/AI Service      │
│    (Node.js/Express)      │  │   (Python/FastAPI)   │
│  ┌─────────────────────┐  │  │  ┌────────────────┐  │
│  │ Auth Service        │  │  │  │ Renege Predict │  │
│  │ Candidate Service   │  │  │  │ Sentiment AI   │  │
│  │ Communication Svc   │  │  │  │ Smart Schedule │  │
│  │ Document Service    │  │  │  │ Anomaly Detect │  │
│  │ Analytics Service   │  │  │  └────────────────┘  │
│  │ Notification Svc    │  │  └──────────────────────┘
│  └─────────────────────┘  │
└───────────────────────────┘
         │        │
         │        └──────────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL     │    │      Redis       │
│   (RDS)          │    │  (ElastiCache)   │
└──────────────────┘    └──────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│           AWS Services                    │
│  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │  S3  │  │ SES  │  │ SQS  │           │
│  └──────┘  └──────┘  └──────┘           │
└──────────────────────────────────────────┘
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

#### AI/ML Endpoints (ML Service)
```
POST   /api/ml/predict-renege                  # Predict renege risk
POST   /api/ml/analyze-sentiment               # Analyze sentiment
POST   /api/ml/recommend-action                # Get recommended actions
POST   /api/ml/detect-anomaly                  # Detect anomalies
POST   /api/ml/optimal-timing                  # Suggest optimal contact time
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

## 6. AI/ML Features Design

### 6.1 Renege Prediction Model

**Algorithm**: Random Forest / Gradient Boosting
**Features**:
- Days to joining
- Response time to communications (avg, max)
- Number of communications sent vs responded
- Sentiment scores (avg, trend)
- Stage transition delays
- Joining date changes count
- Last contact days ago
- Document submission delays
- Region
- Role level

**Output**: Probability score (0-1) → Risk level (LOW/MEDIUM/HIGH)

**Training**: Historical candidate data with outcomes (joined/reneged)

### 6.2 Sentiment Analysis

**Approach**: Fine-tuned BERT or use pre-trained sentiment model
**Input**: Email responses, call notes
**Output**: Sentiment score (-1 to 1), label (POSITIVE/NEUTRAL/NEGATIVE)

**Use Cases**:
- Track candidate engagement over time
- Flag negative sentiment for intervention
- Measure communication effectiveness

### 6.3 Smart Scheduling

**Algorithm**: Reinforcement Learning or Rule-based
**Factors**:
- Candidate's response patterns (time of day, day of week)
- Historical engagement rates
- Timezone
- Stage urgency

**Output**: Optimal time to send next communication

### 6.4 Anomaly Detection

**Algorithm**: Isolation Forest / Autoencoders
**Monitor**:
- Unusual response patterns
- Sudden sentiment drops
- Stage duration outliers
- Communication frequency anomalies

**Output**: Anomaly flag + severity

### 6.5 Recommendation Engine

**Input**: Candidate profile, current state, historical patterns
**Output**: Suggested actions (e.g., "Schedule HM call", "Send culture video", "Check compensation concerns")

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

## 8. Deployment Architecture (AWS)

### 8.1 Production Environment

```
Route 53 (DNS)
    ↓
CloudFront (CDN) → S3 (Static Frontend)
    ↓
Application Load Balancer
    ↓
    ├─→ ECS Fargate (Backend API) [Auto-scaling 2-10 instances]
    └─→ ECS Fargate (ML Service) [Auto-scaling 1-5 instances]
         ↓
         ├─→ RDS PostgreSQL (Multi-AZ)
         ├─→ ElastiCache Redis (Cluster mode)
         ├─→ S3 (Document storage)
         ├─→ SES (Email service)
         └─→ SQS (Message queue)
```

### 8.2 Environment Configuration
- **Development**: Single instance, t3.small
- **Staging**: 2 instances, t3.medium
- **Production**: Auto-scaling 2-10 instances, t3.large

### 8.3 CI/CD Pipeline
1. Code push to GitHub
2. GitHub Actions triggers build
3. Run tests (unit, integration)
4. Build Docker images
5. Push to ECR
6. Deploy to ECS via CodeDeploy (Blue/Green)
7. Run smoke tests
8. Complete deployment

## 9. Performance Optimization

### 9.1 Caching Strategy
- **Redis caching**:
  - User sessions (TTL: 24h)
  - Candidate lists (TTL: 5min)
  - Dashboard metrics (TTL: 15min)
  - Templates (TTL: 1h)

### 9.2 Database Optimization
- **Indexes** on frequently queried fields
- **Connection pooling**: Max 20 connections
- **Query optimization**: Use Prisma's query builder
- **Pagination**: Limit 50 items per page

### 9.3 API Optimization
- **Response compression**: gzip
- **Lazy loading**: Pagination on large datasets
- **GraphQL** (future): For flexible data fetching

## 10. Monitoring & Observability

### 10.1 Metrics to Track
- **API**: Response time, error rate, throughput
- **Database**: Query time, connection count
- **ML**: Model latency, prediction accuracy
- **Business**: Candidate counts, conversion rates

### 10.2 Logging
- **Application logs**: Winston (JSON format)
- **Access logs**: Morgan
- **Centralized logging**: CloudWatch Logs

### 10.3 Alerting
- **High error rate** (>5% in 5min)
- **Slow response time** (>2s avg)
- **Database connection issues**
- **Email delivery failures**
- **High-risk candidates detected**

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

### 11.3 ML Testing
- **Model validation**: Cross-validation, train/test split
- **A/B testing**: Compare model versions
- **Monitoring**: Track prediction accuracy over time

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

### Phase 3 (Month 3): AI Features
- Renege prediction model
- Sentiment analysis
- Smart notifications
- Anomaly detection

### Phase 4 (Ongoing): Enhancements
- Mobile app
- ATS integration
- WhatsApp/SMS
- Advanced reporting

## 13. Risk Mitigation

### 13.1 Technical Risks
- **Risk**: ML model accuracy issues
  - **Mitigation**: Start with rule-based fallback, gradual rollout

- **Risk**: Email deliverability problems
  - **Mitigation**: Use reputable service (SES), monitor bounce rates

- **Risk**: Performance degradation at scale
  - **Mitigation**: Load testing, auto-scaling, caching

### 13.2 Business Risks
- **Risk**: Low user adoption
  - **Mitigation**: User training, intuitive UI, gradual rollout

- **Risk**: Data privacy concerns
  - **Mitigation**: GDPR compliance, transparent policies

## 14. Future Enhancements

### 14.1 Advanced AI
- **Conversational AI**: Chatbot for candidate queries
- **Voice analysis**: Analyze candidate call recordings
- **Predictive analytics**: Forecast hiring pipeline

### 14.2 Integration
- **ATS systems**: Greenhouse, Lever, Workday
- **HRMS**: BambooHR, Workday
- **Communication**: Slack, Microsoft Teams

### 14.3 Advanced Features
- **Mobile app**: Native iOS/Android apps
- **Workflow automation**: No-code workflow builder
- **Custom reports**: Drag-and-drop report builder
- **Multi-language**: Support 10+ languages

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

**Why PostgreSQL?**
- ACID compliance for critical data
- Excellent JSON support (for metadata)
- Mature and reliable

**Why AWS?**
- Comprehensive service offerings
- Excellent documentation
- Industry-standard for enterprise

**Why AI/ML?**
- Competitive advantage through intelligence
- Proactive vs reactive candidate management
- Data-driven decision making

### 15.2 References
- AWS Well-Architected Framework
- OWASP Top 10 Security Guidelines
- React Best Practices
- PostgreSQL Performance Tuning Guide
- ML Model Deployment Best Practices
