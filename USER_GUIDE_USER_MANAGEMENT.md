# User Management Dashboard - User Guide

**Version:** 1.0  
**Last Updated:** October 28, 2025  
**For:** MedEnroll Pro - Enhanced Provider Management

---

## Table of Contents

1. [Overview](#overview)
2. [Accessing the Dashboard](#accessing-the-dashboard)
3. [Dashboard Layout](#dashboard-layout)
4. [Managing User Roles](#managing-user-roles)
5. [Searching and Filtering](#searching-and-filtering)
6. [Understanding User Roles](#understanding-user-roles)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Security Considerations](#security-considerations)

---

## Overview

The User Management Dashboard is an **administrator-only** feature that allows you to manage user accounts, assign roles, and monitor user activity within MedEnroll Pro. This powerful tool gives you complete control over who can access your system and what they can do.

### Key Features

- **View All Users** - See complete list of all system users
- **Role Management** - Assign and modify user roles (Viewer, Manager, Admin)
- **Activity Monitoring** - Track last sign-in times and account creation dates
- **Search & Filter** - Quickly find users by name, email, or role
- **Statistics Dashboard** - View user distribution across roles
- **Role Descriptions** - Clear explanations of each role's permissions

---

## Accessing the Dashboard

### Prerequisites

- You must have **Administrator** role to access this dashboard
- You must be logged into MedEnroll Pro

### Navigation

1. **Log in** to MedEnroll Pro with your administrator account
2. Look for the **"Users"** menu item in the left sidebar (appears only for admins)
3. Click on **"Users"** to open the User Management Dashboard

> **Note:** If you don't see the "Users" menu item, you don't have administrator privileges. Contact your system administrator to request access.

### Access Denied Message

If you attempt to access the dashboard without administrator privileges, you'll see:

```
🛡️ Access Denied
You need administrator privileges to access this page.
```

---

## Dashboard Layout

The User Management Dashboard is organized into four main sections:

### 1. Statistics Cards (Top Section)

Four cards display key metrics:

- **Total Users** - Total number of registered users (blue)
- **Administrators** - Number of users with admin role (red)
- **Managers** - Number of users with manager role (blue)
- **Viewers** - Number of users with viewer role (gray)

### 2. Search and Filter Bar

Located below the statistics cards:

- **Search Box** - Search users by name or email
- **Role Filter** - Dropdown to filter by role (All Roles, Admin, Manager, Viewer)

### 3. User Accounts Table

The main table displays all users with the following columns:

| Column | Description |
|--------|-------------|
| **Name** | User's full name (with "You" badge for your account) |
| **Email** | User's email address |
| **Role** | Current role with color-coded badge |
| **Last Sign In** | Time since last login (e.g., "about 1 hour ago") |
| **Created** | Time since account creation |
| **Actions** | Role change dropdown (or "Cannot modify own role") |

### 4. Role Descriptions (Bottom Section)

Three cards explaining each role's permissions:

- **Viewer** - Read-only access
- **Manager** - Create and update capabilities
- **Admin** - Full system access

---

## Managing User Roles

### Viewing User Information

All user information is displayed in the main table. Each row shows:

- User's name and email
- Current role (with color-coded badge)
- Activity timestamps
- Your own account is marked with a "You" badge

### Changing a User's Role

**Step-by-Step Instructions:**

1. **Locate the user** in the table (use search if needed)
2. **Find the Actions column** on the right side of the table
3. **Click the role dropdown** (shows current role with gear icon)
4. **Select the new role** from the dropdown:
   - Viewer
   - Manager
   - Admin
5. **Confirmation** - You'll see a success message: "User role updated successfully"

> **Important:** You cannot change your own role. The Actions column will show "Cannot modify own role" for your account.

### Role Change Workflow Example

**Scenario:** Promoting a viewer to manager

```
1. Search for user: "John Smith"
2. Locate John in the table
3. Current role shows: [Viewer] badge
4. Click dropdown in Actions column
5. Select "Manager"
6. ✅ Success: "User role updated successfully"
7. Role badge updates to: [Manager]
```

### Bulk Operations

Currently, role changes must be done one user at a time. Bulk role assignment is planned for a future release.

---

## Searching and Filtering

### Search Functionality

The search box allows you to find users by:

- **Name** (partial match, case-insensitive)
- **Email** (partial match, case-insensitive)

**Examples:**

- Search "john" → Finds "John Smith", "Johnny Doe", "john@example.com"
- Search "@gmail" → Finds all users with Gmail addresses
- Search "admin" → Finds users with "admin" in their name or email

### Filter by Role

Use the role filter dropdown to show only users with a specific role:

1. Click the **"All Roles"** dropdown (shield icon)
2. Select a role:
   - **All Roles** - Show everyone (default)
   - **Admin** - Show only administrators
   - **Manager** - Show only managers
   - **Viewer** - Show only viewers

### Combining Search and Filter

You can use search and filter together for precise results:

**Example:** Find all managers with "Smith" in their name
1. Set filter to "Manager"
2. Type "Smith" in search box
3. Results show only managers named Smith

---

## Understanding User Roles

MedEnroll Pro uses a three-tier role hierarchy: **Viewer < Manager < Admin**

### Viewer Role

**Badge Color:** Gray  
**Access Level:** Read-only

**Permissions:**
- ✅ View providers and enrollments
- ✅ View reports
- ❌ Cannot create or edit data
- ❌ Cannot delete data
- ❌ Cannot export reports
- ❌ Cannot manage users

**Best For:**
- Staff who need to view provider information
- Auditors and compliance reviewers
- Read-only stakeholders

### Manager Role

**Badge Color:** Blue  
**Access Level:** Create and Update

**Permissions:**
- ✅ All viewer permissions
- ✅ Create new providers
- ✅ Update provider information
- ✅ Manage payer enrollments
- ✅ Export reports to CSV
- ❌ Cannot delete providers
- ❌ Cannot manage users

**Best For:**
- Credentialing coordinators
- Provider enrollment specialists
- Team leads who manage provider data

### Admin Role

**Badge Color:** Red  
**Access Level:** Full system access

**Permissions:**
- ✅ All manager permissions
- ✅ Delete providers
- ✅ Manage user accounts
- ✅ Assign and change user roles
- ✅ Access user management dashboard
- ✅ Full system configuration

**Best For:**
- System administrators
- Practice managers
- IT staff
- Account owners

---

## Best Practices

### Role Assignment Guidelines

1. **Principle of Least Privilege**
   - Assign the minimum role needed for each user's job function
   - Start with Viewer, upgrade only when necessary

2. **Multiple Administrators**
   - Maintain at least 2-3 admin accounts
   - Prevents lockout if one admin leaves
   - Ensures continuity of access management

3. **Regular Audits**
   - Review user roles quarterly
   - Remove or downgrade inactive users
   - Verify role assignments match current responsibilities

4. **Documentation**
   - Keep a record of why each user has their assigned role
   - Document role change decisions
   - Maintain contact information for all admins

### Security Best Practices

1. **Protect Admin Accounts**
   - Use strong passwords
   - Enable MFA when available (coming soon)
   - Never share admin credentials

2. **Monitor Activity**
   - Check "Last Sign In" column regularly
   - Investigate accounts with no recent activity
   - Review role changes periodically

3. **Onboarding New Users**
   - Start new users as Viewers
   - Provide training before upgrading to Manager
   - Only promote to Admin after thorough vetting

4. **Offboarding Users**
   - Downgrade to Viewer when staff changes roles
   - Plan for user deactivation feature (coming soon)
   - Document access removal in your records

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot see Users menu item"

**Cause:** You don't have administrator role  
**Solution:** Contact your system administrator to request admin access

---

#### Issue: "Access Denied" message on Users page

**Cause:** Your account doesn't have admin privileges  
**Solution:** 
1. Verify you're logged in with the correct account
2. Contact an existing administrator to upgrade your role
3. If you're the account owner, contact support

---

#### Issue: "Cannot modify own role" in Actions column

**Cause:** System prevents self-role modification for security  
**Solution:** This is intentional. Ask another administrator to change your role if needed

---

#### Issue: Role change doesn't appear to work

**Cause:** May be a temporary connection issue  
**Solution:**
1. Refresh the page (F5 or Ctrl+R)
2. Check if the role actually changed
3. Try the operation again
4. If persistent, contact support

---

#### Issue: User not appearing in list

**Cause:** User may not have logged in yet  
**Solution:**
1. Users appear after their first login
2. Check if invitation was sent
3. Verify user completed registration
4. Clear search/filter to see all users

---

#### Issue: Search returns no results

**Cause:** Search term doesn't match any users  
**Solution:**
1. Try partial names or email addresses
2. Clear the role filter
3. Check spelling
4. Try searching by email instead of name

---

## Security Considerations

### Important Security Features

1. **Self-Modification Protection**
   - Administrators cannot change their own role
   - Prevents accidental privilege loss
   - Requires another admin to modify your role

2. **Role-Based Access Control**
   - All actions are permission-checked on the server
   - Frontend restrictions are backed by backend security
   - Attempting unauthorized actions results in error

3. **Audit Trail (Coming Soon)**
   - All role changes will be logged
   - Track who changed what and when
   - Compliance reporting capabilities

### What Administrators Can See

As an administrator, you can see:
- ✅ All user names and email addresses
- ✅ All user roles
- ✅ Last sign-in times
- ✅ Account creation dates

You **cannot** see:
- ❌ User passwords
- ❌ Login credentials
- ❌ OAuth tokens
- ❌ Personal authentication details

### Data Privacy

- User email addresses are visible to administrators
- This is necessary for user management
- Treat user information as confidential
- Follow your organization's privacy policies

---

## Quick Reference

### Role Permission Matrix

| Action | Viewer | Manager | Admin |
|--------|--------|---------|-------|
| View providers | ✅ | ✅ | ✅ |
| View reports | ✅ | ✅ | ✅ |
| Create providers | ❌ | ✅ | ✅ |
| Update providers | ❌ | ✅ | ✅ |
| Delete providers | ❌ | ❌ | ✅ |
| Export reports | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Change roles | ❌ | ❌ | ✅ |

### Role Badge Colors

- 🔴 **Red** = Admin
- 🔵 **Blue** = Manager
- ⚪ **Gray** = Viewer

### Keyboard Shortcuts

- **Tab** - Navigate between search and filter
- **Enter** - Submit search
- **Escape** - Clear search box
- **F5** - Refresh page

---

## Getting Help

### Support Resources

1. **In-App Help**
   - Role descriptions are always visible at the bottom of the page
   - Hover over elements for tooltips (where available)

2. **Contact Support**
   - Email: support@medenrollpro.com
   - Submit feedback at: https://help.manus.im

3. **Documentation**
   - Full system documentation available in Settings
   - Check for updates and new features

### Reporting Issues

When reporting a problem, include:
- Your role (Admin)
- What you were trying to do
- What happened instead
- Any error messages you saw
- Screenshot if possible

---

## Future Enhancements

The following features are planned for future releases:

- **User Deactivation** - Temporarily disable user accounts
- **Audit Logging** - Complete history of all role changes
- **Bulk Operations** - Change multiple user roles at once
- **User Invitation** - Invite new users via email
- **Activity Reports** - Detailed user activity analytics
- **MFA Enforcement** - Require multi-factor authentication

---

## Appendix: Role Change Scenarios

### Scenario 1: New Employee Onboarding

**Situation:** Sarah joins as a credentialing coordinator

**Steps:**
1. Sarah logs in for the first time (automatically created as Viewer)
2. Admin searches for "Sarah" in User Management
3. Admin changes role from Viewer to Manager
4. Sarah can now create and update providers

---

### Scenario 2: Employee Promotion

**Situation:** Mike promoted from coordinator to department manager

**Steps:**
1. Admin opens User Management Dashboard
2. Admin filters by "Manager" to see current managers
3. Admin searches for "Mike"
4. Admin changes role from Manager to Admin
5. Mike now has full system access

---

### Scenario 3: Role Downgrade

**Situation:** Emma moving to a different department, needs read-only access

**Steps:**
1. Admin locates Emma in user list
2. Current role shows "Manager"
3. Admin changes role to "Viewer"
4. Emma retains access but can no longer edit data

---

### Scenario 4: Multiple Admins

**Situation:** Practice needs 3 administrators for redundancy

**Steps:**
1. Identify 3 trusted staff members
2. Ensure they have Manager role first
3. Upgrade each to Admin one at a time
4. Verify each can access User Management
5. Document admin contact information

---

## Glossary

**Administrator (Admin)** - User with full system access and user management capabilities

**Badge** - Colored label showing user's current role

**Manager** - User who can create and update data but cannot delete or manage users

**OpenID** - Unique identifier for each user account

**Role** - Set of permissions assigned to a user

**Role Hierarchy** - System where higher roles inherit permissions from lower roles

**Self-Modification** - Attempting to change your own role (blocked for security)

**Viewer** - User with read-only access to the system

---

**End of User Guide**

For questions or feedback, please contact your system administrator or visit https://help.manus.im

