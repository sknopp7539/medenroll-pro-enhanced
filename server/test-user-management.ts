/**
 * User Management Dashboard Test Suite
 * Tests admin-only user management functionality
 */

import { createCaller } from './routers';
import { getDb } from './db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function logTest(testName: string, passed: boolean, error?: string, details?: string) {
  results.push({ testName, passed, error, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${testName}`);
  if (error) console.log(`  Error: ${error}`);
  if (details) console.log(`  Details: ${details}`);
}

async function setupTestUsers() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Clean up any existing test users
  await db.delete(users).where(eq(users.openId, 'test-admin-123'));
  await db.delete(users).where(eq(users.openId, 'test-manager-456'));
  await db.delete(users).where(eq(users.openId, 'test-viewer-789'));

  // Create test users
  await db.insert(users).values([
    {
      openId: 'test-admin-123',
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'admin',
      loginMethod: 'test',
    },
    {
      openId: 'test-manager-456',
      name: 'Test Manager',
      email: 'manager@test.com',
      role: 'manager',
      loginMethod: 'test',
    },
    {
      openId: 'test-viewer-789',
      name: 'Test Viewer',
      email: 'viewer@test.com',
      role: 'viewer',
      loginMethod: 'test',
    },
  ]);

  console.log('✅ Test users created');
}

async function cleanupTestUsers() {
  const db = await getDb();
  if (!db) return;

  await db.delete(users).where(eq(users.openId, 'test-admin-123'));
  await db.delete(users).where(eq(users.openId, 'test-manager-456'));
  await db.delete(users).where(eq(users.openId, 'test-viewer-789'));

  console.log('✅ Test users cleaned up');
}

async function runTests() {
  console.log('🧪 Starting User Management Dashboard Tests\n');

  try {
    await setupTestUsers();

    // Test 1: Admin can list all users
    try {
      const adminCaller = createCaller({
        user: {
          openId: 'test-admin-123',
          name: 'Test Admin',
          email: 'admin@test.com',
          role: 'admin',
        },
      });

      const userList = await adminCaller.users.list();
      const hasTestUsers = userList.some(u => u.openId === 'test-manager-456');
      
      logTest(
        'Admin can list all users',
        hasTestUsers && userList.length >= 3,
        hasTestUsers ? undefined : 'Test users not found in list',
        `Found ${userList.length} users`
      );
    } catch (error: any) {
      logTest('Admin can list all users', false, error.message);
    }

    // Test 2: Manager cannot list users
    try {
      const managerCaller = createCaller({
        user: {
          openId: 'test-manager-456',
          name: 'Test Manager',
          email: 'manager@test.com',
          role: 'manager',
        },
      });

      await managerCaller.users.list();
      logTest('Manager cannot list users', false, 'Manager was able to list users (should be forbidden)');
    } catch (error: any) {
      const isForbidden = error.message.includes('admin') || error.code === 'FORBIDDEN';
      logTest('Manager cannot list users', isForbidden, isForbidden ? undefined : error.message);
    }

    // Test 3: Viewer cannot list users
    try {
      const viewerCaller = createCaller({
        user: {
          openId: 'test-viewer-789',
          name: 'Test Viewer',
          email: 'viewer@test.com',
          role: 'viewer',
        },
      });

      await viewerCaller.users.list();
      logTest('Viewer cannot list users', false, 'Viewer was able to list users (should be forbidden)');
    } catch (error: any) {
      const isForbidden = error.message.includes('admin') || error.code === 'FORBIDDEN';
      logTest('Viewer cannot list users', isForbidden, isForbidden ? undefined : error.message);
    }

    // Test 4: Admin can change user role
    try {
      const adminCaller = createCaller({
        user: {
          openId: 'test-admin-123',
          name: 'Test Admin',
          email: 'admin@test.com',
          role: 'admin',
        },
      });

      await adminCaller.users.updateRole({
        openId: 'test-viewer-789',
        role: 'manager',
      });

      // Verify the role was changed
      const updatedUser = await adminCaller.users.getById({ openId: 'test-viewer-789' });
      logTest(
        'Admin can change user role',
        updatedUser.role === 'manager',
        updatedUser.role !== 'manager' ? `Role is ${updatedUser.role}, expected manager` : undefined
      );
    } catch (error: any) {
      logTest('Admin can change user role', false, error.message);
    }

    // Test 5: Admin cannot change own role
    try {
      const adminCaller = createCaller({
        user: {
          openId: 'test-admin-123',
          name: 'Test Admin',
          email: 'admin@test.com',
          role: 'admin',
        },
      });

      await adminCaller.users.updateRole({
        openId: 'test-admin-123',
        role: 'viewer',
      });

      logTest('Admin cannot change own role', false, 'Admin was able to change own role (should be prevented)');
    } catch (error: any) {
      const isBlocked = error.message.includes('own role');
      logTest('Admin cannot change own role', isBlocked, isBlocked ? undefined : error.message);
    }

    // Test 6: Manager cannot change user roles
    try {
      const managerCaller = createCaller({
        user: {
          openId: 'test-manager-456',
          name: 'Test Manager',
          email: 'manager@test.com',
          role: 'manager',
        },
      });

      await managerCaller.users.updateRole({
        openId: 'test-viewer-789',
        role: 'admin',
      });

      logTest('Manager cannot change user roles', false, 'Manager was able to change roles (should be forbidden)');
    } catch (error: any) {
      const isForbidden = error.message.includes('admin') || error.code === 'FORBIDDEN';
      logTest('Manager cannot change user roles', isForbidden, isForbidden ? undefined : error.message);
    }

    // Test 7: Admin can get user by openId
    try {
      const adminCaller = createCaller({
        user: {
          openId: 'test-admin-123',
          name: 'Test Admin',
          email: 'admin@test.com',
          role: 'admin',
        },
      });

      const user = await adminCaller.users.getById({ openId: 'test-manager-456' });
      logTest(
        'Admin can get user by openId',
        user.name === 'Test Manager',
        user.name !== 'Test Manager' ? 'Wrong user returned' : undefined
      );
    } catch (error: any) {
      logTest('Admin can get user by openId', false, error.message);
    }

    // Test 8: User can get own info
    try {
      const viewerCaller = createCaller({
        user: {
          openId: 'test-viewer-789',
          name: 'Test Viewer',
          email: 'viewer@test.com',
          role: 'viewer',
        },
      });

      const me = await viewerCaller.users.me();
      logTest(
        'User can get own info',
        me?.openId === 'test-viewer-789',
        me?.openId !== 'test-viewer-789' ? 'Wrong user info returned' : undefined
      );
    } catch (error: any) {
      logTest('User can get own info', false, error.message);
    }

  } catch (error: any) {
    console.error('❌ Test suite failed:', error.message);
  } finally {
    await cleanupTestUsers();
  }

  // Print summary
  console.log('\n📊 Test Summary');
  console.log('═══════════════════════════════════════════════════════════');
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);
  
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Pass Rate: ${passRate}%`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Review the results above.');
  }

  process.exit(passed === total ? 0 : 1);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

