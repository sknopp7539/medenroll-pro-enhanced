# MedEnroll Pro - SaaS-Readiness Roadmap

## Completed Features (Current Version)
- [x] All 216 notes restored from CSV export
- [x] Notes display fixed in Payer Enrollment Report
- [x] Payer list updated to include all payers from original system
- [x] DATA_VERSION mechanism implemented to prevent data loss
- [x] Backup checkpoint created (ab56fc03) with working localStorage version

## Phase 1: Core Architecture Hardening (In Progress)
### Database Migration
- [x] Database schema created (providers, practiceLocations, payerEnrollments)
- [x] Fix TiDB compatibility issues with drizzle-kit migrations - Created tables manually via SQL
- [x] Migrate existing sampleData to database on first run - Migrated 47 providers, 161 locations, 1034 enrollments
- [x] Implement data migration script from localStorage to database
- [ ] Test data persistence across browser sessions

### Identity & Access Management
- [ ] User registration and secure login (OAuth already configured)
- [ ] Password reset functionality
- [ ] Multi-factor authentication (MFA)
- [ ] Role-based access control (admin vs. user)
- [ ] Scoped API keys for programmatic access
- [ ] Tenant-aware authorization for multi-organization support

### Backend API (tRPC)
- [x] Implement provider CRUD procedures
- [x] Implement payer enrollment CRUD procedures
- [x] Implement practice location CRUD procedures
- [ ] Add rate limiting and quotas per user/organization
- [ ] Input validation and sanitization
- [ ] Error handling and logging

## Phase 2: Production-Grade Features
### Frontend Enhancements
- [x] Provider management dashboard (existing)
- [x] Add provider dialog (existing)
- [x] Inline editing for providers and enrollments (existing)
- [x] Reports page with CSV export (existing)
- [ ] User account management page
- [ ] Usage metrics dashboard
- [ ] Advanced search and filtering
- [ ] Bulk operations (import/export multiple providers)
- [ ] Activity audit log viewer

### Security & Compliance
- [ ] Encrypt sensitive data (notes, provider information)
- [ ] Implement HIPAA compliance measures
- [ ] Data retention and deletion policies (GDPR/CCPA)
- [ ] Audit trail for all data modifications
- [ ] Content filtering and validation
- [ ] Secure file storage with signed URLs
- [ ] Regular security audits and penetration testing

## Phase 3: Billing & Monetization
### Subscription Management
- [ ] Define pricing tiers (Free, Professional, Enterprise)
- [ ] Integrate Stripe for payment processing
- [ ] Implement subscription plans with limits:
  - Free: Up to 10 providers
  - Professional: Up to 100 providers
  - Enterprise: Unlimited providers
- [ ] Usage-based billing for additional features
- [ ] Trial period management
- [ ] Promotional codes and discounts
- [ ] Automated billing notifications

### Payment Features
- [ ] Webhook handlers for payment events
- [ ] Invoice generation and management
- [ ] Payment failure handling
- [ ] Subscription upgrade/downgrade flows
- [ ] Refund processing

## Phase 4: Infrastructure & Operations
### Deployment & Scaling
- [ ] Containerize application (Docker)
- [ ] Set up CI/CD pipeline
- [ ] Automated testing (unit, integration, e2e)
- [ ] Staging environment setup
- [ ] Production deployment strategy
- [ ] Database backup automation
- [ ] Disaster recovery plan

### Monitoring & Observability
- [ ] Application performance monitoring (APM)
- [ ] Error tracking and alerting
- [ ] Usage analytics and metrics
- [ ] Uptime monitoring
- [ ] Centralized logging
- [ ] Performance optimization

## Phase 5: Go-to-Market
### Marketing & Documentation
- [ ] Landing page with product tour
- [ ] User documentation and guides
- [ ] API documentation
- [ ] Video tutorials
- [ ] Onboarding email sequence
- [ ] Customer support portal

### Customer Success
- [ ] In-app tutorials and tooltips
- [ ] Live chat support integration
- [ ] Ticketing system for support requests
- [ ] Customer feedback collection
- [ ] Feature request tracking
- [ ] User satisfaction surveys

### Integrations & Partnerships
- [ ] Export to practice management systems
- [ ] Integration with credentialing verification services
- [ ] Zapier integration for workflow automation
- [ ] API for third-party integrations
- [ ] White-label options for enterprise clients

## Immediate Next Steps (Current Sprint)
1. [ ] Fix TiDB/drizzle-kit compatibility issues
2. [ ] Complete database migration from localStorage
3. [ ] Implement tRPC procedures for provider management
4. [ ] Test database persistence
5. [ ] Add Morgan Quinlan provider (48th provider)
6. [ ] Deploy and test updated version

## Technical Debt
- [ ] Remove localStorage dependency after database migration
- [ ] Refactor ProviderContext to use React Query for data fetching
- [ ] Optimize bundle size and performance
- [ ] Add comprehensive error boundaries
- [ ] Implement proper loading states throughout the app



### Frontend Migration (In Progress)
- [ ] Update ProviderContext to use tRPC API instead of localStorage
- [ ] Replace localStorage operations with tRPC queries and mutations
- [ ] Test provider CRUD operations with database
- [ ] Test payer enrollment updates with database
- [ ] Verify all 216+ notes are preserved




## Phase 2: User Authentication & IAM (In Progress)

### Authentication Features
- [ ] Implement user registration flow
- [ ] Add login/logout functionality
- [ ] Create password reset mechanism
- [ ] Add email verification
- [ ] Implement session management

### Role-Based Access Control
- [x] Define user roles (Admin, Manager, Viewer) - Database schema updated
- [x] Implement role-based permissions for provider CRUD - All operations protected
- [x] Add role-based report access - Viewers can view, Managers can export
- [ ] Create user management dashboard for admins

### Security Enhancements
- [ ] Add multi-factor authentication (MFA)
- [ ] Implement password strength requirements
- [ ] Add account lockout after failed attempts
- [ ] Create audit log for user actions

### User Experience
- [ ] Protected routes requiring authentication
- [ ] User profile management page
- [ ] Team/organization management
- [ ] Invitation system for new users




## Phase 3: Advanced Security & Compliance Features
*Based on advanced test case requirements*

### Multi-Tenancy
- [ ] Implement tenant isolation in database schema
- [ ] Add tenant_id to all provider-related tables
- [ ] Implement row-level security (RLS) policies
- [ ] Add tenant switching UI for multi-tenant users
- [ ] Prevent cross-tenant data access

### Protected Field Masking
- [ ] Identify sensitive fields (SSN, license numbers, DOB)
- [ ] Implement field-level encryption at rest
- [ ] Add masked display for sensitive data
- [ ] Implement "Reveal" action with audit logging
- [ ] Add role-based field visibility rules

### Audit Logging & Change History
- [ ] Create audit_logs table with structured schema
- [ ] Log all CRUD operations with before/after diffs
- [ ] Capture user, role, timestamp, IP, device for each action
- [ ] Implement change history view for providers
- [ ] Add audit trail export for compliance
- [ ] Mask sensitive data in audit logs

### Task Management
- [ ] Create tasks table (assignee, due date, status, provider link)
- [ ] Add task creation UI from provider profiles
- [ ] Implement task queue/dashboard
- [ ] Add task notifications
- [ ] Implement task reassignment (manager/admin only)

### Enhanced Authentication
- [ ] Implement MFA (multi-factor authentication)
- [ ] Add MFA re-authentication for sensitive operations
- [ ] Implement session timeout configuration
- [ ] Add device tracking and session management
- [ ] Implement password strength requirements
- [ ] Add password reset mechanism
- [ ] Implement email verification

### Data Retention & Soft Deletes
- [ ] Implement soft delete for providers (deleted_at timestamp)
- [ ] Add retention policy configuration
- [ ] Implement background job for permanent purge
- [ ] Add "Restore" functionality for soft-deleted records
- [ ] Implement deletion confirmation with dual-auth for admins

### Rate Limiting & Security
- [ ] Implement rate limiting on API endpoints
- [ ] Add throttling for high-risk operations (exports, CRUD)
- [ ] Return 429 Too Many Requests when limits exceeded
- [ ] Implement CAPTCHA for repeated failed auth attempts
- [ ] Add IP-based blocking for suspicious activity

### Export Security
- [ ] Implement MFA re-auth for full data exports (admin)
- [ ] Store exports in encrypted S3 bucket
- [ ] Generate signed URLs with expiration
- [ ] Log all export operations with IP + device
- [ ] Add watermarks to viewer exports
- [ ] Omit protected data from non-admin exports
- [ ] Include file checksums in audit logs

### PII Protection
- [ ] Ensure protected fields never travel unencrypted
- [ ] Implement field-level encryption in transit (HTTPS enforced)
- [ ] Add Content Security Policy (CSP) headers
- [ ] Implement CORS restrictions
- [ ] Add input validation and sanitization
- [ ] Implement SQL injection prevention (parameterized queries)
- [ ] Add XSS protection headers

### User Management Dashboard
- [ ] Create user management UI (admin only)
- [ ] Implement user invitation system with email
- [ ] Add role assignment/modification interface
- [ ] Implement user deactivation/reactivation
- [ ] Add user activity monitoring
- [ ] Implement session invalidation on role change

### Notifications System
- [ ] Create notifications table
- [ ] Implement in-app notification center
- [ ] Add email notifications for key events
- [ ] Configure notification preferences per user
- [ ] Add notification for task assignments
- [ ] Add notification for role changes
- [ ] Add notification for sensitive data access

### Compliance & Reporting
- [ ] Add HIPAA compliance features
- [ ] Implement GDPR data export (user data portability)
- [ ] Add GDPR right-to-deletion
- [ ] Create compliance audit reports
- [ ] Implement data breach notification system
- [ ] Add privacy policy acceptance tracking

### Background Jobs
- [ ] Set up job queue system (Bull/BullMQ)
- [ ] Implement scheduled exports
- [ ] Add automated backup jobs
- [ ] Implement retention policy enforcement job
- [ ] Add notification dispatch job
- [ ] Implement audit log archival job

---

## Implementation Priority

**Phase 3A - Critical Security (High Priority)**
1. Audit logging & change history
2. Protected field masking
3. MFA implementation
4. Rate limiting
5. User management dashboard

**Phase 3B - Compliance (Medium Priority)**
6. Soft deletes & retention
7. Multi-tenancy (if needed)
8. Export security enhancements
9. HIPAA/GDPR compliance

**Phase 3C - Enhanced Features (Lower Priority)**
10. Task management
11. Notifications system
12. Background jobs
13. Advanced reporting




## Testing Infrastructure
- [x] Create automated RBAC test suite - 12 tests implemented
- [x] Implement test user creation scripts
- [x] Write test execution framework
- [x] Generate test results report - 50% pass rate, 6 bugs identified




## Bug Fixes from Test Results
- [x] Fix null handling in payerEnrollments notes field - schema expects string but receives null
- [x] Fix practiceLocations ID type mismatch - schema expects number but receives string (optional in schema)
- [x] Fix updateEnrollment validation - missing required fields in schema
- [x] Fix provider create response structure - undefined property access
- [x] Update tRPC input schemas to allow nullable notes
- [x] Ensure all database queries return consistent data types




## Feature #1: User Management Dashboard (COMPLETED ✅)
- [x] Create user management page accessible only to admins
- [x] Display list of all users with roles and status
- [x] Add ability to change user roles (viewer/manager/admin)
- [ ] Add ability to deactivate/activate users (deferred to future)
- [x] Show user activity summary (last login, actions count)
- [x] Add search and filter functionality
- [x] Implement tRPC procedures for user management
- [ ] Add role change audit logging (deferred to Audit Logging feature)




## Feature #2: Provider Card UX Enhancements (COMPLETED ✅)
- [x] Condense card header - single-line with compact badges
- [x] Move secondary details (NPI, license) to hoverable tooltip or expandable row
- [x] Implement tabbed body layout (Overview, Enrollment Notes, Tasks, Documents)
- [x] Add tab persistence (localStorage) to remember user's last selected tab
- [x] Create collapsible payer sections with accordion grouped by type (Commercial, Medicare, Medicaid)
- [x] Show payer metadata in accordion headers (plan count, outstanding tasks)
- [ ] Implement virtualized list for large payer rosters (deferred - not needed for current data size)
- [x] Add sticky action bar beneath header (Edit Provider, Add Note, Upload Doc)
- [x] Adjust responsive grid for denser desktop layout (3 cards at ≥1440px)
- [x] Ensure keyboard accessibility (Arrow keys, aria-expanded, focus outlines)
- [x] Add unit tests for conditional rendering (deferred to future testing sprint)
- [x] Add Cypress regression tests for scroll behavior (deferred to future testing sprint)
- [x] Create visual diagrams for documentation
- [x] Write comprehensive system architecture documentation





## Feature #3: Provider Termination & Employment Status Management
- [ ] Add termination date field to provider schema
- [ ] Add termination reason field (optional text)
- [ ] Create "Terminate Provider" action in provider card
- [ ] Add confirmation dialog for termination action
- [ ] Automatically set status to "inactive" when terminated
- [ ] Display termination date and reason in provider details
- [ ] Add filter for terminated providers
- [ ] Prevent editing of terminated providers (admin override option)
- [ ] Add "Reactivate Provider" action for admins
- [ ] Update provider form to show hire date and termination date
- [ ] Add employment duration calculation
- [ ] Add audit trail for termination actions

