# Administrator Quick Guide - User Management

**For:** System Administrators  
**Access Level:** Full System Access  
**Version:** 1.0

---

## Your Responsibilities as Admin

As an administrator, you have **full control** over MedEnroll Pro, including:

- ✅ Managing all user accounts and roles
- ✅ Deleting providers and data
- ✅ Accessing all system features
- ✅ Configuring system settings

**With great power comes great responsibility** - use admin privileges carefully.

---

## Quick Access: User Management

### How to Access
1. Click **"Users"** in the left sidebar (admin-only menu)
2. View all users and their roles

### Dashboard Overview

**Statistics at a Glance:**
- Total Users, Admins, Managers, Viewers counts

**Main Actions:**
- Search users by name/email
- Filter by role
- Change user roles
- Monitor last sign-in times

---

## Common Admin Tasks

### Task 1: Promote a User to Manager

**When:** Employee needs to create/edit providers

**Steps:**
1. Open User Management (Users menu)
2. Search for the user by name
3. Find their row in the table
4. Click the role dropdown (Actions column)
5. Select **"Manager"**
6. ✅ Done! User can now create/edit data

**Time:** 30 seconds

---

### Task 2: Create a New Admin

**When:** Need another administrator for redundancy

**Steps:**
1. Ensure user has logged in at least once (appears in list)
2. Search for the user
3. Change role to **"Admin"**
4. Verify they can see "Users" menu item
5. Document new admin's contact info

**⚠️ Best Practice:** Maintain 2-3 admins minimum

---

### Task 3: Downgrade a User's Access

**When:** Employee changes roles or leaves

**Steps:**
1. Find user in User Management
2. Change role to **"Viewer"** (read-only)
3. User retains access but cannot edit

**Note:** User deactivation feature coming soon

---

### Task 4: Audit User Access

**When:** Monthly or quarterly review

**Steps:**
1. Open User Management Dashboard
2. Check "Last Sign In" column
3. Identify inactive accounts (no recent login)
4. Review if roles still match job functions
5. Downgrade or remove access as needed

**Frequency:** Monthly recommended

---

## Role Assignment Decision Tree

```
New User Logs In
    ↓
Start as VIEWER (default)
    ↓
Does user need to edit data?
    ├─ NO → Keep as VIEWER
    └─ YES → Promote to MANAGER
              ↓
         Does user need to delete or manage users?
              ├─ NO → Keep as MANAGER
              └─ YES → Promote to ADMIN
```

---

## Security Checklist

### Daily
- [ ] Monitor for unusual login activity

### Weekly
- [ ] Review new user accounts
- [ ] Verify role assignments

### Monthly
- [ ] Audit all admin accounts
- [ ] Check for inactive users
- [ ] Review "Last Sign In" times

### Quarterly
- [ ] Full user access review
- [ ] Update admin contact list
- [ ] Document role change decisions

---

## What You Can and Cannot Do

### ✅ You CAN:
- Change any user's role (except your own)
- View all user information
- Delete providers and data
- Access all system features
- Export all reports

### ❌ You CANNOT:
- Change your own role (need another admin)
- See user passwords
- Access OAuth credentials
- Bulk change roles (yet - coming soon)

---

## Emergency Procedures

### Lost Admin Access

**Problem:** Last admin account locked or unavailable

**Solution:**
1. Contact Manus support immediately
2. Provide account owner information
3. Support can restore admin access

**Prevention:** Always maintain 2-3 admin accounts

---

### Accidental Role Change

**Problem:** Changed wrong user's role

**Solution:**
1. Immediately change role back
2. Verify user's access is correct
3. Document the incident
4. No permanent harm - roles change instantly

---

### User Cannot Access System

**Problem:** User reports "Access Denied"

**Troubleshooting:**
1. Verify user has logged in at least once
2. Check their role in User Management
3. Ensure they're using correct login method
4. Try changing role to Viewer, then back to intended role
5. Ask user to log out and back in

---

## Quick Reference: Role Permissions

| Feature | Viewer | Manager | Admin |
|---------|--------|---------|-------|
| View providers | ✅ | ✅ | ✅ |
| Create providers | ❌ | ✅ | ✅ |
| Edit providers | ❌ | ✅ | ✅ |
| Delete providers | ❌ | ❌ | ✅ |
| Export reports | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## Tips for Effective User Management

### 1. Start Conservative
- New users begin as Viewers
- Upgrade only when necessary
- Easier to add permissions than remove

### 2. Document Everything
- Keep notes on why users have specific roles
- Track admin contact information
- Record role change decisions

### 3. Regular Communication
- Inform users when roles change
- Explain what their role allows
- Provide training for new Managers

### 4. Plan for Succession
- Don't be the only admin
- Train backup administrators
- Document admin procedures

### 5. Monitor Activity
- Check "Last Sign In" regularly
- Investigate dormant accounts
- Remove access when no longer needed

---

## Common Questions

**Q: How many admins should we have?**  
A: Minimum 2-3 for redundancy. More for larger organizations.

**Q: Can I change my own role?**  
A: No, this is blocked for security. Another admin must change your role.

**Q: What happens if I delete a provider?**  
A: Only admins can delete. Action is immediate and permanent (soft delete coming soon).

**Q: Can managers see the Users page?**  
A: No, User Management is admin-only. Managers cannot see or change roles.

**Q: How do I invite new users?**  
A: Currently, users self-register via OAuth. Invitation system coming soon.

**Q: Can I export the user list?**  
A: Not yet, but this feature is planned for future release.

---

## Getting Help

**For User Management Issues:**
- Check this guide first
- Review full User Guide (USER_GUIDE_USER_MANAGEMENT.md)
- Contact support: https://help.manus.im

**For Technical Issues:**
- Check system status
- Try logging out and back in
- Clear browser cache
- Contact IT support

---

## Next Steps

After reading this guide:

1. ✅ Access User Management Dashboard
2. ✅ Review current user list
3. ✅ Verify role assignments are correct
4. ✅ Identify other potential admins
5. ✅ Set up monthly audit reminder
6. ✅ Document your admin procedures

---

**Remember:** Admin privileges are powerful. Use them wisely, document your decisions, and maintain multiple admins for continuity.

**Questions?** Contact support at https://help.manus.im

