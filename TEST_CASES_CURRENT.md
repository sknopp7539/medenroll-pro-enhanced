# MedEnroll Pro - Current RBAC Test Cases
## Executable Test Suite for Version bb6d8784

**Test Environment:** https://medenrollpro-ccmhbo8h.manus.space/  
**Database:** TiDB with 47 providers, 611 payer enrollments  
**Authentication:** OAuth via Manus platform  

---

## Test Setup

### Test Users Required
| Role | Email | Status | Notes |
|------|-------|--------|-------|
| Admin | stacyknopp1@gmail.com | ✅ Active | Project owner, already configured |
| Manager | [Create new user] | ⏳ Pending | Need to create and assign role |
| Viewer | [Create new user] | ⏳ Pending | Need to create and assign role |

### Setup Steps
1. **Create Manager Test User:**
   ```sql
   -- After user logs in via OAuth, run:
   UPDATE users SET role = 'manager' WHERE email = '[manager-email]';
   ```

2. **Create Viewer Test User:**
   ```sql
   -- After user logs in via OAuth, run:
   UPDATE users SET role = 'viewer' WHERE email = '[viewer-email]';
   ```

3. **Verify Test Data:**
   ```sql
   SELECT COUNT(*) FROM providers; -- Should return 47
   SELECT COUNT(*) FROM payerEnrollments WHERE notes != ''; -- Should return 611
   ```

---

## Viewer Role Test Cases

### V1: View Provider Roster
**Objective:** Verify viewer can see all providers in read-only mode

**Steps:**
1. Log in as Viewer
2. Navigate to Providers page (/)
3. Observe provider cards displayed
4. Look for "Add Provider" button
5. Try to click edit icons on provider cards

**Expected Results:**
- ✅ All 47 providers displayed
- ✅ Provider cards show: name, credential, NPI, specialty, status
- ✅ Statistics show: 29 Active, 3 Pending, 15 Inactive, 27 Flagged
- ❌ "Add Provider" button is hidden or disabled
- ❌ Edit icons are hidden or disabled
- ❌ Delete icons are not visible

**Pass Criteria:** Viewer can see data but has no write controls

---

### V2: Inspect Provider Profile
**Objective:** Verify viewer can view detailed provider information

**Steps:**
1. Log in as Viewer
2. Click on "Alana Sasaki" provider card
3. Expand payer enrollments section
4. Click "+18 more payers" to see all enrollments
5. Look for inline edit fields
6. Try to modify any field

**Expected Results:**
- ✅ Provider details displayed: NPI 1437440849, Specialty: Addiction
- ✅ Practice locations visible: "Off Site (Primary)"
- ✅ All 22 payer enrollments visible
- ✅ Notes displayed for enrollments (e.g., "stacy verified")
- ❌ Inline edit fields are disabled
- ❌ "Quick Save" button is hidden or disabled

**Pass Criteria:** Full read access, no edit capability

---

### V3: Read Enrollment Notes
**Objective:** Verify viewer can read payer enrollment notes

**Steps:**
1. Log in as Viewer
2. Navigate to Reports page
3. Click "Payer Enrollment Report"
4. Scroll to find providers with notes
5. Verify long notes are fully displayed (Medica, PrimeWest)

**Expected Results:**
- ✅ Report shows 47 providers, 611 enrollments with notes
- ✅ Medica note displays full content (multiple payer types)
- ✅ PrimeWest note shows complete Kathy McGinn message
- ✅ "stacy verified" notes visible throughout

**Pass Criteria:** All notes readable without truncation

---

### V4: Attempt Unauthorized Mutation
**Objective:** Verify viewer cannot create/update/delete providers

**Steps:**
1. Log in as Viewer
2. Open browser DevTools → Console
3. Try to call create API:
   ```javascript
   trpc.provider.create.mutate({
     provider: { id: 'test-v1', name: 'Test', credential: 'MD', npi: '1234567890', specialty: 'Test', status: 'pending', flagged: false },
     practiceLocations: [],
     payerEnrollments: []
   })
   ```
4. Try to call update API on existing provider
5. Try to call delete API

**Expected Results:**
- ❌ Create call returns error: "This action requires manager role or higher"
- ❌ Update call returns error: "This action requires manager role or higher"
- ❌ Delete call returns error: "This action requires admin role or higher"
- ✅ Browser console shows 403 Forbidden errors
- ✅ No data changes in database

**Pass Criteria:** All mutation attempts blocked with clear error messages

---

### V5: Export Roster Snapshot
**Objective:** Verify viewer cannot export reports (manager+ only)

**Steps:**
1. Log in as Viewer
2. Navigate to Reports page
3. Generate Payer Enrollment Report
4. Look for "Export CSV" button
5. Check browser DevTools for hidden elements

**Expected Results:**
- ❌ "Export CSV" button is hidden or disabled
- ✅ Report displays in browser successfully
- ❌ No download initiated

**Pass Criteria:** Export functionality not available to viewers

---

## Manager Role Test Cases

### M1: Create Provider
**Objective:** Verify manager can create new providers

**Steps:**
1. Log in as Manager
2. Click "Add Provider" button
3. Fill in form:
   - Name: Morgan Quinlan
   - Credential: PA
   - NPI: 1689337230
   - Specialty: Addiction
   - Status: Active
   - License: (leave blank)
   - Practice Location: Off Site (Primary)
4. Add payer enrollments:
   - BCBS BluePlus: Active, Enrollment 10/20/2025, Next Cred 10/20/2028, Note: "stacy verified"
   - UCare: Active, Enrollment 10/10/2025, Next Cred 10/09/2028, Note: "Stacy verified"
5. Submit form

**Expected Results:**
- ✅ "Add Provider" button is visible
- ✅ Form opens and accepts input
- ✅ Provider created successfully
- ✅ Morgan Quinlan appears in provider list
- ✅ Provider count increases from 47 to 48
- ✅ Database contains new provider record

**Pass Criteria:** Manager successfully creates provider with all data

**Verification Query:**
```sql
SELECT * FROM providers WHERE name = 'Morgan Quinlan';
SELECT * FROM payerEnrollments WHERE providerId = (SELECT id FROM providers WHERE name = 'Morgan Quinlan');
```

---

### M2: Edit Provider Field
**Objective:** Verify manager can update existing provider data

**Steps:**
1. Log in as Manager
2. Find "Alana Sasaki" provider
3. Click edit icon
4. Change specialty from "Addiction" to "Addiction Medicine"
5. Update license expiration to "12/31/2026"
6. Click "Quick Save"
7. Refresh page

**Expected Results:**
- ✅ Edit icon is visible and clickable
- ✅ Inline edit fields become active
- ✅ Changes save successfully
- ✅ "Quick Save" button works
- ✅ Changes persist after refresh
- ✅ Database reflects updates

**Pass Criteria:** Manager can edit and save provider data

**Verification Query:**
```sql
SELECT specialty, licenseExpiration FROM providers WHERE name = 'Alana Sasaki';
```

---

### M3: Manage Enrollment Notes
**Objective:** Verify manager can CRUD payer enrollment notes

**Steps:**
1. Log in as Manager
2. Select "Chee Vang" provider
3. Find "Medicaid/MA" enrollment
4. Edit note to add: "Updated by manager test"
5. Save changes
6. Navigate to Reports → Payer Enrollment Report
7. Verify note appears in report

**Expected Results:**
- ✅ Note field is editable
- ✅ Changes save successfully
- ✅ Updated note visible in provider card
- ✅ Updated note visible in report
- ✅ Database contains new note

**Pass Criteria:** Manager can update enrollment notes

**Verification Query:**
```sql
SELECT notes FROM payerEnrollments 
WHERE providerId = (SELECT id FROM providers WHERE name = 'Chee Vang')
AND payerName = 'Medicaid/MA';
```

---

### M4: Export Report with Notes
**Objective:** Verify manager can export complete reports

**Steps:**
1. Log in as Manager
2. Navigate to Reports page
3. Generate Payer Enrollment Report
4. Click "Export CSV" button
5. Open downloaded CSV file
6. Verify data integrity

**Expected Results:**
- ✅ "Export CSV" button is visible and enabled
- ✅ CSV file downloads successfully
- ✅ File contains all 48 providers (after M1)
- ✅ File contains 611+ enrollment notes
- ✅ Long notes (Medica, PrimeWest) are complete
- ✅ Notes with commas/quotes are properly escaped
- ✅ All columns present: Provider, Credential, Status, Payer, Status, Dates, Notes

**Pass Criteria:** Complete CSV export with all data intact

---

### M5: Unauthorized Admin Action
**Objective:** Verify manager cannot delete providers (admin only)

**Steps:**
1. Log in as Manager
2. Look for delete button on provider cards
3. Try to delete via API:
   ```javascript
   trpc.provider.delete.mutate({ id: 'test-provider-id' })
   ```

**Expected Results:**
- ❌ Delete button is hidden or disabled
- ❌ API call returns error: "This action requires admin role or higher"
- ✅ 403 Forbidden error in console
- ✅ No provider deleted from database

**Pass Criteria:** Delete operations blocked for managers

---

## Admin Role Test Cases

### A1: Full CRUD Access
**Objective:** Verify admin has complete access to all operations

**Steps:**
1. Log in as Admin (stacyknopp1@gmail.com)
2. Verify "Add Provider" button visible
3. Create a test provider (same as M1)
4. Edit the test provider (same as M2)
5. Update enrollment notes (same as M3)
6. Export report (same as M4)

**Expected Results:**
- ✅ All manager capabilities work for admin
- ✅ Admin can perform all CRUD operations
- ✅ No permission errors

**Pass Criteria:** Admin has full manager-level access

---

### A2: Delete Provider
**Objective:** Verify only admin can delete providers

**Steps:**
1. Log in as Admin
2. Create a test provider:
   - Name: "Test Delete Provider"
   - Credential: MD
   - NPI: 9999999999
   - Specialty: Test
   - Status: Pending
3. Verify provider appears in list
4. Click delete button/icon
5. Confirm deletion
6. Verify provider removed

**Expected Results:**
- ✅ Delete button is visible for admin
- ✅ Deletion confirmation dialog appears
- ✅ Provider deleted successfully
- ✅ Provider removed from list
- ✅ Database record deleted
- ✅ Related practice locations deleted (cascade)
- ✅ Related payer enrollments deleted (cascade)

**Pass Criteria:** Admin successfully deletes provider with cascade

**Verification Query:**
```sql
SELECT COUNT(*) FROM providers WHERE name = 'Test Delete Provider'; -- Should return 0
SELECT COUNT(*) FROM practiceLocations WHERE providerId = 'test-delete-id'; -- Should return 0
SELECT COUNT(*) FROM payerEnrollments WHERE providerId = 'test-delete-id'; -- Should return 0
```

---

### A3: View All User Roles
**Objective:** Verify admin can see user management (when implemented)

**Steps:**
1. Log in as Admin
2. Look for "Settings" or "User Management" menu
3. Check database directly:
   ```sql
   SELECT id, name, email, role, lastSignedIn FROM users;
   ```

**Expected Results:**
- ⏳ User management UI not yet implemented
- ✅ Admin can query database to see all users
- ✅ Can verify roles are correctly assigned

**Pass Criteria:** Admin has visibility into user roles (via database for now)

---

## Cross-Cutting Tests

### X1: Session Enforcement
**Objective:** Verify unauthenticated users cannot access system

**Steps:**
1. Open application in incognito/private browser
2. Try to access / (providers page)
3. Try to access /reports
4. Try to call API directly without auth token

**Expected Results:**
- ❌ Redirected to OAuth login
- ❌ Cannot access any pages without authentication
- ❌ API returns 401 Unauthorized

**Pass Criteria:** All routes require authentication

---

### X2: Role Escalation Prevention
**Objective:** Verify users cannot elevate their own permissions

**Steps:**
1. Log in as Viewer
2. Try to modify own role via API:
   ```javascript
   // Attempt to call hypothetical user update endpoint
   fetch('/api/trpc/user.updateRole', {
     method: 'POST',
     body: JSON.stringify({ role: 'admin' })
   })
   ```
3. Check role in database

**Expected Results:**
- ❌ No user update endpoint accessible to non-admins
- ❌ Role remains 'viewer'
- ✅ Attempt logged (if audit logging implemented)

**Pass Criteria:** Role escalation attempts blocked

---

### X3: API Direct Access
**Objective:** Verify API enforces same permissions as UI

**Steps:**
1. Obtain auth tokens for each role
2. Test each endpoint with each role using Postman/cURL:

| Endpoint | Viewer | Manager | Admin |
|----------|--------|---------|-------|
| GET /api/trpc/provider.list | 200 ✅ | 200 ✅ | 200 ✅ |
| POST /api/trpc/provider.create | 403 ❌ | 200 ✅ | 200 ✅ |
| PUT /api/trpc/provider.update | 403 ❌ | 200 ✅ | 200 ✅ |
| DELETE /api/trpc/provider.delete | 403 ❌ | 403 ❌ | 200 ✅ |

**Pass Criteria:** API enforces RBAC correctly

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Create manager test user account
- [ ] Create viewer test user account
- [ ] Assign roles via SQL
- [ ] Verify test data (47 providers, 611 notes)
- [ ] Clear browser cache/cookies

### Viewer Tests
- [ ] V1: View Provider Roster
- [ ] V2: Inspect Provider Profile
- [ ] V3: Read Enrollment Notes
- [ ] V4: Attempt Unauthorized Mutation
- [ ] V5: Export Roster Snapshot

### Manager Tests
- [ ] M1: Create Provider (Morgan Quinlan)
- [ ] M2: Edit Provider Field
- [ ] M3: Manage Enrollment Notes
- [ ] M4: Export Report with Notes
- [ ] M5: Unauthorized Admin Action

### Admin Tests
- [ ] A1: Full CRUD Access
- [ ] A2: Delete Provider
- [ ] A3: View All User Roles

### Cross-Cutting Tests
- [ ] X1: Session Enforcement
- [ ] X2: Role Escalation Prevention
- [ ] X3: API Direct Access

### Post-Test Cleanup
- [ ] Delete test providers created during testing
- [ ] Revert any modified data
- [ ] Document any issues found

---

## Test Results Summary

**Test Date:** __________  
**Tester:** __________  
**Environment:** Production / Staging  

| Category | Passed | Failed | Blocked | Total |
|----------|--------|--------|---------|-------|
| Viewer | | | | 5 |
| Manager | | | | 5 |
| Admin | | | | 3 |
| Cross-Cutting | | | | 3 |
| **TOTAL** | | | | **16** |

**Critical Issues:**
1. 
2. 
3. 

**Recommendations:**
1. 
2. 
3. 

**Sign-Off:** ____________________  Date: __________

