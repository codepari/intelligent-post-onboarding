# Post-Onboarding Management System - Requirements Document

## 1. Executive Summary

### 1.1 Purpose
This document outlines the requirements for a Post-Onboarding Management System designed to manage the candidate journey from offer acceptance to Day 1, reducing offer drop-offs and reneges while creating a consistent, high-touch candidate experience globally.

### 1.2 Goals
- Reduce offer drop-offs and reneges
- Create a consistent, high-touch candidate experience globally
- Clearly define ownership across TA, HR, and Hiring Managers
- Ensure candidates feel confident and excited from "Offer → Day 1"

### 1.3 Scope
**In Scope:**
- All candidates who have received a verbal or written offer
- Global hiring (India, US, UK/EU)
- Period from "offer release to date of joining"

**Out of Scope:**
- Pre-offer hiring stages
- Post-Day 1 onboarding activities

## 2. Guiding Principles (Non-Negotiables)
- One owner per candidate (always clear to the candidate)
- No silent periods longer than 7 calendar days
- Proactive communication beats reactive follow-ups
- Candidate experience = Employer brand
- Assume candidates are still interviewing elsewhere

## 3. User Roles & Responsibilities

### 3.1 Talent Acquisition (TA)
- Primary owner from offer release to joining
- Manages all communication touchpoints
- Tracks candidate progress through stages
- Escalates at-risk candidates

### 3.2 Hiring Manager (HM)
- Relationship building and confidence reinforcement
- Conducts midway manager connect call
- Available for Day 1 handoff

### 3.3 HR Operations
- Documentation management
- Background verification (BGV) initiation and tracking
- Joining logistics coordination

### 3.4 HRBP / People Partner
- Handles escalations, exceptions, and risk cases
- Strategic oversight

## 4. Functional Requirements

### 4.1 Candidate Management

#### FR-1: Candidate Profile
- Store candidate personal information (name, email, phone, location)
- Store offer details (job title, compensation, joining date, work arrangement)
- Track offer acceptance status and deadline
- Store assignment of TA, HM, HR Ops contacts
- Support multi-region candidates (India, US, UK/EU)

#### FR-2: Stage Management
System must support six distinct stages:
1. **Offer Release (Day 0)**
2. **Offer Acceptance (Day 1-2)**
3. **Pre-Joining Engagement (Acceptance → Joining)**
4. **Documentation & Background Verification**
5. **Joining Readiness (T-7 to T-1 days)**
6. **Day 1 Handoff**

#### FR-3: Candidate Journey Tracking
- Automatically progress candidates through stages based on actions
- Display current stage for each candidate
- Show days in current stage
- Calculate days until joining date
- Flag candidates with overdue actions

### 4.2 Communication Management

#### FR-4: Communication Timeline
- Display all touchpoints for each candidate
- Track scheduled and completed communications
- Show communication history with timestamps
- Support manual logging of phone calls and meetings

#### FR-5: Standard Engagement Cadence
System must enforce/track:
- Week 1: Welcome/alignment call (TA)
- Every 10-15 days: Check-in (TA)
- Midway: Manager connect (HM)
- T-7 days: Joining confirmation (TA)
- T-1 day: Day 1 reminder (TA)

#### FR-6: Email Templates
Provide templates for:
- Offer acceptance confirmation email
- Welcome email
- Pre-joining check-in message
- Hiring Manager check-in email
- Day 1 email
- Reneging recovery communication

#### FR-7: Communication Tracking
- Mark communications as sent/completed
- Track response status from candidates
- Flag no-response situations (5 days, 7 days)
- Support scheduled email sending

### 4.3 Documentation & BGV Management

#### FR-8: Document Checklist
- Create document requirements per candidate
- Track document submission status
- Support document upload
- Show pending documents

#### FR-9: Background Verification
- Initiate BGV within 48-72 hours post acceptance
- Track BGV status (Not Started, In Progress, Completed, Issues)
- Alert on BGV delays

### 4.4 Risk Management & Alerts

#### FR-10: Early Warning System
Detect and flag:
- Delayed responses (>3 days)
- Repeated joining date pushes
- Avoiding calls
- Silent period >7 days
- Documents not submitted (>5 working days)

#### FR-11: Escalation Management
- Auto-escalate after 5 working days of no response (to TA follow-up)
- Auto-escalate after 7 working days (to TA Manager + TA Leader)
- Manual escalation to HRBP for risk cases
- Track escalation history

#### FR-12: Reneging Management
- Flag candidates at risk of reneging
- Track reneging reasons (compensation, role clarity, counter-offer)
- Record action plan (TA connect, HM intervention, identify blockers)
- Track final outcome (retained/released)

### 4.5 Dashboard & Reporting

#### FR-13: Dashboard Views
- **Overview Dashboard**: Total candidates by stage, at-risk candidates, upcoming actions
- **TA Dashboard**: My candidates, upcoming touchpoints, overdue actions
- **HM Dashboard**: Candidates requiring manager connect
- **HR Ops Dashboard**: Pending documents, BGV status

#### FR-14: Metrics & Analytics
Track and display:
- Offer acceptance rate
- Acceptance → Joining conversion rate
- Average time to join
- Reneges by reason
- Candidates by stage
- Communication response rates
- At-risk candidate count

#### FR-15: Reports
Generate reports for:
- Candidates by status and stage
- Communication effectiveness
- Time-to-join trends
- Renege analysis
- Region-wise metrics

### 4.6 Notifications & Reminders

#### FR-16: Automated Notifications
- Remind TA of upcoming touchpoints (1 day before)
- Alert TA when candidate response overdue
- Notify HM when midway connect due
- Remind HR Ops of document follow-ups
- Alert on approaching joining dates (T-7, T-1)

#### FR-17: Candidate Notifications
- Confirmation emails on stage transitions
- Reminders for pending documents
- Joining date confirmations
- Day 1 instructions

### 4.7 Configuration & Settings

#### FR-18: Template Management
- Create and edit email templates
- Support dynamic fields (name, date, role, etc.)
- Version control for templates
- Region-specific templates

#### FR-19: User Management
- Create users with roles (TA, HM, HR Ops, HRBP, Admin)
- Assign candidates to users
- Manage permissions by role
- Audit user actions

#### FR-20: System Configuration
- Configure communication cadence rules
- Set escalation thresholds
- Define stage transition rules
- Configure notification preferences

## 5. Non-Functional Requirements

### 5.1 Performance
- **NFR-1**: Page load time < 2 seconds
- **NFR-2**: Support 1000+ concurrent users
- **NFR-3**: API response time < 500ms for 95% of requests

### 5.2 Security
- **NFR-4**: Role-based access control (RBAC)
- **NFR-5**: Encrypted data at rest and in transit
- **NFR-6**: Audit logging of all data access and modifications
- **NFR-7**: Secure authentication (JWT-based)
- **NFR-8**: GDPR and data privacy compliance

### 5.3 Scalability
- **NFR-9**: Support 10,000+ candidates in system
- **NFR-10**: Horizontal scaling capability
- **NFR-11**: Database optimization for queries

### 5.4 Reliability
- **NFR-12**: 99.9% uptime SLA
- **NFR-13**: Automated backups (daily)
- **NFR-14**: Disaster recovery plan
- **NFR-15**: Email delivery reliability

### 5.5 Usability
- **NFR-16**: Responsive design (mobile, tablet, desktop)
- **NFR-17**: Intuitive UI requiring minimal training
- **NFR-18**: Accessible (WCAG 2.1 Level AA)
- **NFR-19**: Support for multiple timezones

### 5.6 Maintainability
- **NFR-20**: Modular architecture
- **NFR-21**: Comprehensive API documentation
- **NFR-22**: Automated testing (>80% code coverage)
- **NFR-23**: Logging and monitoring

## 6. Integration Requirements

### 6.1 Email Integration
- **IR-1**: Integration with email service (SendGrid, AWS SES, or similar)
- **IR-2**: Email delivery status tracking
- **IR-3**: Support for email templates with variables

### 6.2 ATS Integration (Future)
- **IR-4**: Import candidates from ATS
- **IR-5**: Sync candidate status updates
- **IR-6**: Export data back to ATS

### 6.3 Calendar Integration (Future)
- **IR-7**: Schedule meetings via Google Calendar/Outlook
- **IR-8**: Send calendar invites for touchpoints

### 6.4 WhatsApp/SMS Integration (Future)
- **IR-9**: Send SMS/WhatsApp reminders
- **IR-10**: Region-appropriate messaging

## 7. Data Requirements

### 7.1 Core Data Entities
1. **Candidates**: Personal info, offer details, status
2. **Communications**: Type, date, status, owner
3. **Documents**: Type, submission date, status
4. **BGV Records**: Status, vendor, dates
5. **Users**: Profile, role, assignments
6. **Templates**: Content, type, region
7. **Escalations**: Reason, date, resolution
8. **Metrics**: Calculated and aggregated data

### 7.2 Data Retention
- Active candidates: Real-time access
- Completed onboarding: 2 years retention
- Analytics data: 5 years retention
- Audit logs: 7 years retention

## 8. User Stories

### 8.1 As a TA Recruiter
- I want to see all my candidates and their stages so I can prioritize my work
- I want to be reminded of upcoming touchpoints so I don't miss communications
- I want to send templated emails easily so I save time
- I want to see at-risk candidates so I can intervene early
- I want to log communications so there's a complete history

### 8.2 As a Hiring Manager
- I want to see when I need to connect with candidates so I can build relationships
- I want to see candidate details before my call so I'm prepared
- I want to provide feedback on candidate interactions so TA is informed

### 8.3 As HR Operations
- I want to track document submissions so I can follow up on pending items
- I want to initiate and track BGV so joining isn't delayed
- I want to prepare Day 1 logistics so candidates have a smooth start

### 8.4 As an HRBP
- I want to see all escalated cases so I can intervene strategically
- I want to see renege trends so I can address systemic issues
- I want to access analytics so I can report to leadership

### 8.5 As a System Admin
- I want to manage users and permissions so access is controlled
- I want to configure system settings so it matches our processes
- I want to edit templates so communications are up to date

## 9. Constraints

### 9.1 Technical Constraints
- Must be cloud-based (AWS preferred)
- Must support modern browsers (Chrome, Firefox, Safari, Edge)
- Must be API-first architecture

### 9.2 Business Constraints
- Initial deployment within 3 months
- Budget for cloud hosting and email services
- Minimal training time required

### 9.3 Regulatory Constraints
- Compliance with data privacy laws (GDPR, CCPA)
- Secure handling of PII
- Right to be forgotten implementation

## 10. Success Criteria

The system will be considered successful if:
- Offer acceptance → Joining conversion rate increases by 15%
- Average response time to candidates < 24 hours
- Zero silent periods >7 days
- TA time spent on tracking reduced by 40%
- Candidate satisfaction score >4.5/5
- System adoption >90% within 3 months

## 11. Future Enhancements

### Phase 2 Features
- AI-powered renege prediction
- Automated candidate sentiment analysis
- Integration with ATS systems
- Mobile app for TA/HM
- WhatsApp/SMS integration
- Advanced analytics and predictive modeling
- Candidate self-service portal
- Buddy matching system
- Culture video library
- Automated meeting scheduling

### Phase 3 Features
- Multi-language support
- Chatbot for candidate queries
- Integration with HRMS for Day 1 handoff
- Workflow automation engine
- Custom reporting builder
- API marketplace for third-party integrations

## 12. Appendix

### 12.1 Glossary
- **TA**: Talent Acquisition
- **HM**: Hiring Manager
- **BGV**: Background Verification
- **ATS**: Applicant Tracking System
- **HRBP**: HR Business Partner
- **PII**: Personally Identifiable Information
- **T-X**: X days before joining (e.g., T-7 = 7 days before joining)

### 12.2 References
- Post Onboarding Playbook (source document)
- Email templates (Appendix in source document)
- Communication standards (source document)
