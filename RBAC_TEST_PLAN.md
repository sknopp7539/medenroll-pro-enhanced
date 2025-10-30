# Role-Based Access Control (RBAC) Test Plan
## MedEnroll Pro - Enhanced Provider Management

**Version:** bb6d8784  
**Date:** October 28, 2025  
**Tester:** _____________  

---

## Test Environment Setup

### Prerequisites
- [ ] Application deployed to staging environment
- [ ] Database contains test data (47 providers, 611 enrollments)
- [ ] Three test user accounts created with different roles:
  - Admin: Stachianna Knopp (stacyknopp1@gmail.com)
  - Manager: [Create test user]
  - Viewer: [Create test user]

### Test Data Verification
- [ ] Verify 47 providers exist in database
- [ ] Verify all payer enrollment notes are present
- [ ] Verify practice locations are populated

---

## Test Cases

### 1. Authentication Tests

#### TC-001: Unauthenticated Access
**Objective:** Verify unauthenticated users cannot access protected resources

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Open application in incognito/private browser | | | |
| 2 | Navigate to /providers | Should redirect to login or show auth error | | |
| 3 | Attempt to access /reports | Should redirect to login or show auth error | | |
| 4 | Try to call API endpoint directly (e.g., GET /api/trpc/provider.list) | Should return 401 Unauthorized | | |

**Expected Outcome:** All protected routes and API endpoints require authentication

---

### 2. Viewer Role Tests

#### TC-002: Viewer - Read Access
**Objective:** Verify viewers can read provider data but not modify

**Test User:** Viewer role account  
**Prerequisites:** Log in as viewer

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Navigate to Providers page | Should display all 47 providers | | |
| 2 | Click on a provider card | Should show provider details | | |
| 3 | Verify payer enrollments visible | Should see all enrollments with notes | | |
| 4 | Check practice locations | Should display all practice locations | | |
| 5 | Navigate to Reports page | Should access reports page | | |
| 6 | Generate Payer Enrollment Report | Should generate and view report | | |

**Expected Outcome:** Viewer can read all data successfully

#### TC-003: Viewer - Write Restrictions
**Objective:** Verify viewers cannot create, update, or delete providers

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Look for "Add Provider" button | Button should be hidden or disabled | | |
| 2 | Try to edit provider name inline | Edit should be disabled or show error | | |
| 3 | Try to update payer enrollment | Update should fail with permission error | | |
| 4 | Attempt to delete a provider (if UI allows) | Should show "Forbidden" error | | |
| 5 | Try API call: POST /api/trpc/provider.create | Should return 403 Forbidden | | |
| 6 | Try API call: PUT /api/trpc/provider.update | Should return 403 Forbidden | | |
| 7 | Try API call: DELETE /api/trpc/provider.delete | Should return 403 Forbidden | | |

**Expected Outcome:** All write operations blocked for viewer

#### TC-004: Viewer - Report Export
**Objective:** Verify viewers cannot export reports (manager+ only)

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Generate Payer Enrollment Report | Report displays successfully | | |
| 2 | Look for "Export CSV" button | Button should be hidden or disabled | | |
| 3 | Try to export via API if accessible | Should return 403 Forbidden | | |

**Expected Outcome:** Export functionality restricted to managers and admins

---

### 3. Manager Role Tests

#### TC-005: Manager - Read Access
**Objective:** Verify managers have full read access

**Test User:** Manager role account  
**Prerequisites:** Log in as manager

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Navigate to Providers page | Should display all 47 providers | | |
| 2 | View provider details | Should see complete provider information | | |
| 3 | Access Reports page | Should access all reports | | |
| 4 | Generate reports | Should generate successfully | | |

**Expected Outcome:** Manager has full read access like viewer

#### TC-006: Manager - Create Provider
**Objective:** Verify managers can create new providers

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Click "Add Provider" button | Should open provider creation form | | |
| 2 | Fill in provider details (name, NPI, specialty, etc.) | Form accepts input | | |
| 3 | Add practice locations | Should allow adding locations | | |
| 4 | Add payer enrollments | Should allow adding enrollments | | |
| 5 | Submit form | Provider created successfully | | |
| 6 | Verify new provider appears in list | Provider visible with correct data | | |
| 7 | Check database | Provider record exists in database | | |

**Expected Outcome:** Manager successfully creates provider

**Test Data:**
- Name: Test Provider (Manager)
- Credential: MD
- NPI: 9999999999
- Specialty: Test Specialty
- Status: Pending

#### TC-007: Manager - Update Provider
**Objective:** Verify managers can update existing providers

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Select an existing provider | Provider details displayed | | |
| 2 | Edit provider name | Change accepted | | |
| 3 | Update NPI number | Change accepted | | |
| 4 | Modify specialty | Change accepted | | |
| 5 | Change status (active/pending/inactive) | Change accepted | | |
| 6 | Update practice location | Change accepted | | |
| 7 | Save changes | Update successful | | |
| 8 | Refresh page | Changes persisted | | |
| 9 | Check database | Database reflects updates | | |

**Expected Outcome:** Manager successfully updates provider

#### TC-008: Manager - Update Payer Enrollment
**Objective:** Verify managers can update payer enrollments

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Select a provider with enrollments | Enrollments displayed | | |
| 2 | Edit enrollment status | Change accepted | | |
| 3 | Update enrollment date | Change accepted | | |
| 4 | Modify next credentialing date | Change accepted | | |
| 5 | Add/edit notes | Notes saved successfully | | |
| 6 | Save changes | Update successful | | |
| 7 | Verify changes persisted | Data remains after refresh | | |

**Expected Outcome:** Manager successfully updates enrollment

#### TC-009: Manager - Delete Restrictions
**Objective:** Verify managers cannot delete providers (admin only)

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Look for delete provider option | Delete button hidden or disabled | | |
| 2 | Try API call: DELETE /api/trpc/provider.delete | Should return 403 Forbidden | | |
| 3 | Attempt to delete via any UI method | Should show permission error | | |

**Expected Outcome:** Delete operations blocked for manager

#### TC-010: Manager - Export Reports
**Objective:** Verify managers can export reports

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Generate Payer Enrollment Report | Report displays | | |
| 2 | Click "Export CSV" button | CSV download initiated | | |
| 3 | Open downloaded CSV | File contains all provider data | | |
| 4 | Verify notes in CSV | Long notes (Medica, PrimeWest) fully exported | | |
| 5 | Check data integrity | All 47 providers with 611 notes present | | |

**Expected Outcome:** Manager successfully exports complete reports

---

### 4. Admin Role Tests

#### TC-011: Admin - Full Read/Write Access
**Objective:** Verify admins have complete CRUD access

**Test User:** Admin role account (Stachianna Knopp)  
**Prerequisites:** Log in as admin

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Navigate to Providers page | All providers visible | | |
| 2 | Create new provider | Success | | |
| 3 | Update existing provider | Success | | |
| 4 | Update payer enrollment | Success | | |
| 5 | Access all reports | Success | | |
| 6 | Export reports | Success | | |

**Expected Outcome:** Admin has full access to all operations

#### TC-012: Admin - Delete Provider
**Objective:** Verify only admins can delete providers

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Select a test provider | Provider details displayed | | |
| 2 | Look for delete option | Delete button visible and enabled | | |
| 3 | Click delete | Confirmation dialog appears | | |
| 4 | Confirm deletion | Provider deleted successfully | | |
| 5 | Verify provider removed from list | Provider no longer visible | | |
| 6 | Check database | Provider and related data deleted | | |
| 7 | Verify cascade delete | Practice locations and enrollments also deleted | | |

**Expected Outcome:** Admin successfully deletes provider with cascade

**Test Data:** Use the test provider created in TC-006

---

### 5. Permission Boundary Tests

#### TC-013: Role Escalation Prevention
**Objective:** Verify users cannot escalate their own permissions

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Log in as viewer | Viewer role confirmed | | |
| 2 | Try to modify user role via API | Should return 403 Forbidden | | |
| 3 | Attempt to access admin-only endpoints | Should return 403 Forbidden | | |
| 4 | Log in as manager | Manager role confirmed | | |
| 5 | Try to access admin delete endpoint | Should return 403 Forbidden | | |

**Expected Outcome:** Role escalation attempts blocked

#### TC-014: Cross-User Data Access
**Objective:** Verify users can only access appropriate data

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Log in as viewer | Access granted | | |
| 2 | View all providers | All 47 providers visible | | |
| 3 | Log in as different viewer | Access granted | | |
| 4 | View same providers | Same 47 providers visible | | |
| 5 | Verify no user-specific filtering | All users see same data | | |

**Expected Outcome:** All authenticated users see same provider data (no user-specific isolation)

---

### 6. API Security Tests

#### TC-015: Direct API Access Control
**Objective:** Verify API endpoints enforce RBAC

**Tools:** Postman, cURL, or browser DevTools

| Endpoint | Method | Viewer | Manager | Admin | Expected Result |
|----------|--------|--------|---------|-------|-----------------|
| /api/trpc/provider.list | GET | ✓ | ✓ | ✓ | All roles can read |
| /api/trpc/provider.getById | GET | ✓ | ✓ | ✓ | All roles can read |
| /api/trpc/provider.create | POST | ✗ | ✓ | ✓ | Manager+ can create |
| /api/trpc/provider.update | PUT | ✗ | ✓ | ✓ | Manager+ can update |
| /api/trpc/provider.updateEnrollment | PUT | ✗ | ✓ | ✓ | Manager+ can update |
| /api/trpc/provider.delete | DELETE | ✗ | ✗ | ✓ | Admin only can delete |

**Test Steps:**
1. Obtain authentication token for each role
2. Make API calls with appropriate tokens
3. Verify response codes (200 for allowed, 403 for forbidden)
4. Verify error messages are informative

**Expected Outcome:** API enforces RBAC correctly

---

### 7. UI/UX Permission Tests

#### TC-016: UI Element Visibility
**Objective:** Verify UI adapts based on user role

| UI Element | Viewer | Manager | Admin | Notes |
|------------|--------|---------|-------|-------|
| "Add Provider" button | Hidden | Visible | Visible | |
| Edit provider button | Hidden | Visible | Visible | |
| Delete provider button | Hidden | Hidden | Visible | |
| "Export CSV" button | Hidden | Visible | Visible | |
| Inline edit fields | Disabled | Enabled | Enabled | |
| User management menu | Hidden | Hidden | Visible | Future feature |

**Test Steps:**
1. Log in as each role
2. Navigate through application
3. Document which UI elements are visible/enabled
4. Verify matches expected permissions

**Expected Outcome:** UI correctly shows/hides features based on role

---

### 8. Error Handling Tests

#### TC-017: Permission Error Messages
**Objective:** Verify clear error messages for permission denials

| Step | Action | Expected Error Message | Pass/Fail | Notes |
|------|--------|----------------------|-----------|-------|
| 1 | Viewer tries to create provider | "This action requires manager role or higher" | | |
| 2 | Manager tries to delete provider | "This action requires admin role or higher" | | |
| 3 | Unauthenticated user accesses API | "You must be logged in to perform this action" | | |
| 4 | Viewer tries to export report | Clear permission denied message | | |

**Expected Outcome:** Error messages are clear and actionable

---

### 9. Session and Authentication Tests

#### TC-018: Session Persistence
**Objective:** Verify user sessions persist correctly

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Log in as admin | Session established | | |
| 2 | Perform admin action (delete) | Success | | |
| 3 | Refresh page | Still logged in as admin | | |
| 4 | Close and reopen browser | Session persists (if configured) | | |
| 5 | Wait for session timeout | Session expires appropriately | | |

**Expected Outcome:** Sessions work as configured

#### TC-019: Role Changes
**Objective:** Verify role changes take effect immediately

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | User logged in as viewer | Viewer permissions active | | |
| 2 | Admin changes user role to manager | Role updated in database | | |
| 3 | User refreshes page | New permissions take effect | | |
| 4 | User can now create providers | Manager permissions active | | |

**Expected Outcome:** Role changes reflected immediately after refresh

---

### 10. Data Integrity Tests

#### TC-020: Audit Trail
**Objective:** Verify actions are logged appropriately

| Step | Action | Expected Log Entry | Pass/Fail | Notes |
|------|--------|-------------------|-----------|-------|
| 1 | Manager creates provider | Log shows user, action, timestamp | | |
| 2 | Manager updates enrollment | Log shows what changed | | |
| 3 | Admin deletes provider | Log shows deletion with user info | | |
| 4 | Review audit logs | All actions traceable | | |

**Expected Outcome:** Comprehensive audit trail maintained

**Note:** This test depends on audit logging implementation

---

## Test Execution Summary

### Overall Results

| Test Category | Total Tests | Passed | Failed | Blocked | Pass Rate |
|--------------|-------------|--------|--------|---------|-----------|
| Authentication | 1 | | | | |
| Viewer Role | 3 | | | | |
| Manager Role | 6 | | | | |
| Admin Role | 2 | | | | |
| Permission Boundaries | 2 | | | | |
| API Security | 1 | | | | |
| UI/UX Permissions | 1 | | | | |
| Error Handling | 1 | | | | |
| Session/Auth | 2 | | | | |
| Data Integrity | 1 | | | | |
| **TOTAL** | **20** | | | | |

### Critical Issues Found
_Document any critical security or permission issues discovered_

1. 
2. 
3. 

### Recommendations
_List recommended fixes or improvements_

1. 
2. 
3. 

---

## Sign-Off

**Tester:** ___________________________  Date: __________

**Reviewer:** __________________________  Date: __________

**Approved for Production:** ____________  Date: __________

---

## Appendix A: Test User Accounts

| Role | Email | Name | Password | Notes |
|------|-------|------|----------|-------|
| Admin | stacyknopp1@gmail.com | Stachianna Knopp | [OAuth] | Project owner |
| Manager | [TBD] | [TBD] | [TBD] | Create test account |
| Viewer | [TBD] | [TBD] | [TBD] | Create test account |

## Appendix B: API Endpoint Reference

```
Base URL: https://medenrollpro-ccmhbo8h.manus.space/api/trpc

Endpoints:
- provider.list (GET) - List all providers
- provider.getById (GET) - Get single provider
- provider.create (POST) - Create provider
- provider.update (PUT) - Update provider
- provider.delete (DELETE) - Delete provider
- provider.updateEnrollment (PUT) - Update payer enrollment
```

## Appendix C: Database Verification Queries

```sql
-- Check user roles
SELECT id, name, email, role FROM users;

-- Count providers
SELECT COUNT(*) FROM providers;

-- Count enrollments with notes
SELECT COUNT(*) FROM payerEnrollments WHERE notes IS NOT NULL AND notes != '';

-- Verify test provider exists
SELECT * FROM providers WHERE name LIKE '%Test Provider%';
```

