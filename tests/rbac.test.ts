import { getDb } from "../server/db";
import { users, providers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { createCaller } from "../server/routers";

/**
 * Automated RBAC Test Suite
 * Tests role-based access control for Viewer, Manager, and Admin roles
 */

interface TestResult {
  id: string;
  name: string;
  role: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const testResults: TestResult[] = [];

// Test user IDs
const TEST_USERS = {
  admin: process.env.OWNER_OPEN_ID || "admin-test-id",
  manager: "manager-test-id",
  viewer: "viewer-test-id",
};

/**
 * Helper: Create test context for a specific role
 */
function createTestContext(userId: string, role: "viewer" | "manager" | "admin") {
  return {
    user: {
      id: userId,
      openId: userId,
      name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `test-${role}@example.com`,
      role,
    },
    req: {} as any,
    res: {} as any,
  };
}

/**
 * Helper: Run a test and record results
 */
async function runTest(
  id: string,
  name: string,
  role: string,
  testFn: () => Promise<void>
): Promise<void> {
  const startTime = Date.now();
  try {
    await testFn();
    testResults.push({
      id,
      name,
      role,
      passed: true,
      duration: Date.now() - startTime,
    });
    console.log(`✅ ${id}: ${name}`);
  } catch (error: any) {
    testResults.push({
      id,
      name,
      role,
      passed: false,
      error: error.message,
      duration: Date.now() - startTime,
    });
    console.log(`❌ ${id}: ${name} - ${error.message}`);
  }
}

/**
 * Setup: Ensure admin user has correct role
 */
async function setupTestUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  console.log("📋 Setting up test users...");

  // Ensure admin user has admin role
  await db.update(users).set({ role: "admin" }).where(eq(users.openId, TEST_USERS.admin));
  
  console.log("✅ Test users ready");
}

/**
 * Cleanup: Remove test data
 */
async function cleanupTestData() {
  const db = await getDb();
  if (!db) return;

  console.log("🧹 Cleaning up test data...");

  // Delete test providers
  await db.delete(providers).where(eq(providers.name, "Test Delete Provider"));
  await db.delete(providers).where(eq(providers.name, "Morgan Quinlan"));
  
  console.log("✅ Test data cleaned up");
}

/**
 * VIEWER ROLE TESTS
 */
async function testViewerReadAccess() {
  const ctx = createTestContext(TEST_USERS.viewer, "viewer");
  const caller = createCaller(ctx);

  await runTest("V1", "View Provider Roster", "Viewer", async () => {
    const result = await caller.providers.list();
    if (result.length < 47) {
      throw new Error(`Expected at least 47 providers, got ${result.length}`);
    }
  });

  await runTest("V2", "Inspect Provider Profile", "Viewer", async () => {
    const result = await caller.providers.list();
    const alana = result.find((p) => p.name === "Alana Sasaki");
    if (!alana) throw new Error("Alana Sasaki not found");
    if (alana.npi !== "1437440849") throw new Error("NPI mismatch");
  });

  await runTest("V3", "Read Enrollment Notes", "Viewer", async () => {
    const result = await caller.providers.list();
    let notesCount = 0;
    result.forEach((p) => {
      p.payerEnrollments.forEach((e) => {
        if (e.notes && e.notes.trim() !== "") notesCount++;
      });
    });
    if (notesCount < 600) {
      throw new Error(`Expected 600+ notes, got ${notesCount}`);
    }
  });
}

async function testViewerWriteRestrictions() {
  const ctx = createTestContext(TEST_USERS.viewer, "viewer");
  const caller = createCaller(ctx);

  await runTest("V4", "Block Unauthorized Create", "Viewer", async () => {
    try {
      await caller.providers.create({
        provider: {
          id: "test-v1",
          name: "Test Viewer Create",
          credential: "MD",
          npi: "1234567890",
          specialty: "Test",
          status: "pending",
          flagged: false,
        },
        practiceLocations: [],
        payerEnrollments: [],
      });
      throw new Error("Create should have been blocked");
    } catch (error: any) {
      if (!error.message.includes("manager")) {
        throw new Error(`Wrong error: ${error.message}`);
      }
    }
  });

  await runTest("V5", "Block Unauthorized Update", "Viewer", async () => {
    const providersList = await caller.providers.list();
    const first = providersList[0];

    try {
      await caller.providers.update({
        id: first.id,
        provider: { ...first, name: "Modified" },
        practiceLocations: first.practiceLocations,
        payerEnrollments: first.payerEnrollments,
      });
      throw new Error("Update should have been blocked");
    } catch (error: any) {
      if (!error.message.includes("manager")) {
        throw new Error(`Wrong error: ${error.message}`);
      }
    }
  });

  await runTest("V6", "Block Unauthorized Delete", "Viewer", async () => {
    const providersList = await caller.providers.list();
    const first = providersList[0];

    try {
      await caller.providers.delete({ id: first.id });
      throw new Error("Delete should have been blocked");
    } catch (error: any) {
      if (!error.message.includes("admin")) {
        throw new Error(`Wrong error: ${error.message}`);
      }
    }
  });
}

/**
 * MANAGER ROLE TESTS
 */
async function testManagerCreateProvider() {
  const ctx = createTestContext(TEST_USERS.manager, "manager");
  const caller = createCaller(ctx);

  await runTest("M1", "Create Provider", "Manager", async () => {
    const result = await caller.providers.create({
      provider: {
        id: "morgan-quinlan-test",
        name: "Morgan Quinlan",
        credential: "PA",
        npi: "1689337230",
        specialty: "Addiction",
        status: "active",
        flagged: false,
      },
      practiceLocations: [
        {
          name: "Off Site",
          type: "primary" as const,
        },
      ],
      payerEnrollments: [
        {
          id: "mq-enroll-1",
          payerName: "BCBS BluePlus",
          status: "active" as const,
          enrollmentDate: "2025-10-20",
          nextCredentialing: "2028-10-20",
          notes: "stacy verified",
        },
      ],
    });

    if (result.provider.name !== "Morgan Quinlan") {
      throw new Error("Provider not created correctly");
    }
  });
}

async function testManagerUpdateProvider() {
  const ctx = createTestContext(TEST_USERS.manager, "manager");
  const caller = createCaller(ctx);

  await runTest("M2", "Update Provider", "Manager", async () => {
    const providersList = await caller.providers.list();
    const alana = providersList.find((p) => p.name === "Alana Sasaki");
    if (!alana) throw new Error("Alana Sasaki not found");

    await caller.providers.update({
      id: alana.id,
      provider: {
        ...alana,
        specialty: "Addiction Medicine",
      },
      practiceLocations: alana.practiceLocations,
      payerEnrollments: alana.payerEnrollments,
    });

    // Verify
    const updated = await caller.providers.getById({ id: alana.id });
    if (updated.specialty !== "Addiction Medicine") {
      throw new Error("Update failed");
    }
  });
}

async function testManagerUpdateNotes() {
  const ctx = createTestContext(TEST_USERS.manager, "manager");
  const caller = createCaller(ctx);

  await runTest("M3", "Update Enrollment Notes", "Manager", async () => {
    const providersList = await caller.providers.list();
    const chee = providersList.find((p) => p.name === "Chee Vang");
    if (!chee) throw new Error("Chee Vang not found");

    const enrollment = chee.payerEnrollments.find((e) => e.payerName === "Medicaid/MA");
    if (!enrollment) throw new Error("Enrollment not found");

    await caller.providers.updateEnrollment({
      id: enrollment.id,
      enrollment: {
        ...enrollment,
        notes: "Updated by manager test",
      },
    });

    // Verify
    const updated = await caller.providers.getById({ id: chee.id });
    const updatedEnroll = updated.payerEnrollments.find((e) => e.payerName === "Medicaid/MA");
    if (updatedEnroll?.notes !== "Updated by manager test") {
      throw new Error("Notes not updated");
    }
  });
}

async function testManagerDeleteRestriction() {
  const ctx = createTestContext(TEST_USERS.manager, "manager");
  const caller = createCaller(ctx);

  await runTest("M4", "Block Manager Delete", "Manager", async () => {
    // Use the Morgan Quinlan created in M1 test
    const testId = "morgan-quinlan-test";

    try {
      await caller.providers.delete({ id: testId });
      throw new Error("Delete should have been blocked");
    } catch (error: any) {
      if (!error.message.includes("admin")) {
        throw new Error(`Wrong error: ${error.message}`);
      }
    }
  });
}

/**
 * ADMIN ROLE TESTS
 */
async function testAdminFullAccess() {
  const ctx = createTestContext(TEST_USERS.admin, "admin");
  const caller = createCaller(ctx);

  await runTest("A1", "Admin Full CRUD", "Admin", async () => {
    // Create
    const created = await caller.providers.create({
      provider: {
        id: "test-delete-provider",
        name: "Test Delete Provider",
        credential: "MD",
        npi: "9999999999",
        specialty: "Test",
        status: "pending",
        flagged: false,
      },
      practiceLocations: [],
      payerEnrollments: [],
    });

    if (created.provider.name !== "Test Delete Provider") {
      throw new Error("Create failed");
    }

    // Update
    await caller.providers.update({
      id: created.provider.id,
      provider: { ...created.provider, specialty: "Updated" },
      practiceLocations: [],
      payerEnrollments: [],
    });

    // Verify
    const updated = await caller.providers.getById({ id: created.provider.id });
    if (updated.specialty !== "Updated") {
      throw new Error("Update failed");
    }
  });
}

async function testAdminDelete() {
  const ctx = createTestContext(TEST_USERS.admin, "admin");
  const caller = createCaller(ctx);

  await runTest("A2", "Admin Delete Provider", "Admin", async () => {
    const providersList = await caller.providers.list();
    const testProvider = providersList.find((p) => p.name === "Test Delete Provider");
    if (!testProvider) throw new Error("Test provider not found");

    // Delete
    await caller.providers.delete({ id: testProvider.id });

    // Verify
    const remaining = await caller.providers.list();
    const deleted = remaining.find((p) => p.id === testProvider.id);
    if (deleted) {
      throw new Error("Provider not deleted");
    }
  });
}

/**
 * Generate Report
 */
function generateReport(): string {
  const passed = testResults.filter((r) => r.passed).length;
  const failed = testResults.filter((r) => !r.passed).length;
  const total = testResults.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  let report = `# RBAC Test Results Report\n\n`;
  report += `**Test Date:** ${new Date().toLocaleString()}\n`;
  report += `**Environment:** Development\n`;
  report += `**Version:** bb6d8784\n\n`;

  report += `## Executive Summary\n\n`;
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| Total Tests | ${total} |\n`;
  report += `| Passed | ${passed} ✅ |\n`;
  report += `| Failed | ${failed} ❌ |\n`;
  report += `| Pass Rate | ${passRate}% |\n`;
  report += `| Total Duration | ${testResults.reduce((sum, r) => sum + r.duration, 0)}ms |\n\n`;

  // By role
  report += `## Results by Role\n\n`;
  ["Viewer", "Manager", "Admin"].forEach((role) => {
    const roleTests = testResults.filter((r) => r.role === role);
    const rolePassed = roleTests.filter((r) => r.passed).length;
    const roleTotal = roleTests.length;
    report += `### ${role} (${rolePassed}/${roleTotal})\n\n`;
    report += `| ID | Test Name | Result | Duration |\n`;
    report += `|----|-----------|--------|----------|\n`;
    roleTests.forEach((r) => {
      const status = r.passed ? "✅ PASS" : "❌ FAIL";
      report += `| ${r.id} | ${r.name} | ${status} | ${r.duration}ms |\n`;
    });
    report += `\n`;
  });

  // Failures
  const failedTests = testResults.filter((r) => !r.passed);
  if (failedTests.length > 0) {
    report += `## Failed Tests\n\n`;
    failedTests.forEach((r) => {
      report += `### ${r.id}: ${r.name}\n`;
      report += `**Error:** ${r.error}\n\n`;
    });
  }

  // Detailed results
  report += `## Detailed Results\n\n`;
  testResults.forEach((r) => {
    const status = r.passed ? "✅ PASS" : "❌ FAIL";
    report += `- **${r.id}** (${r.role}): ${r.name} - ${status} (${r.duration}ms)\n`;
    if (r.error) {
      report += `  - Error: ${r.error}\n`;
    }
  });

  return report;
}

/**
 * Main
 */
async function runAllTests() {
  console.log("🧪 RBAC Test Suite\n");
  console.log("=".repeat(60));

  try {
    await setupTestUsers();

    console.log("\n" + "=".repeat(60));
    console.log("VIEWER TESTS");
    console.log("=".repeat(60));
    await testViewerReadAccess();
    await testViewerWriteRestrictions();

    console.log("\n" + "=".repeat(60));
    console.log("MANAGER TESTS");
    console.log("=".repeat(60));
    await testManagerCreateProvider();
    await testManagerUpdateProvider();
    await testManagerUpdateNotes();
    await testManagerDeleteRestriction();

    console.log("\n" + "=".repeat(60));
    console.log("ADMIN TESTS");
    console.log("=".repeat(60));
    await testAdminFullAccess();
    await testAdminDelete();

    console.log("\n" + "=".repeat(60));
    console.log("CLEANUP");
    console.log("=".repeat(60));
    await cleanupTestData();

    console.log("\n" + "=".repeat(60));
    console.log("GENERATING REPORT");
    console.log("=".repeat(60));
    const report = generateReport();
    
    const fs = await import("fs/promises");
    await fs.writeFile("/home/ubuntu/medenroll-pro-enhanced/TEST_RESULTS.md", report);
    console.log("✅ Report saved to TEST_RESULTS.md\n");

    console.log(report);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test suite failed:", error);
    process.exit(1);
  }
}

runAllTests();

