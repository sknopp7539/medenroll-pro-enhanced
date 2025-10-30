/**
 * Data migration script to load sampleData into the database
 * Run this once to migrate from localStorage to database
 */

import { getDb } from "./db";
import { providers, practiceLocations, payerEnrollments } from "../drizzle/schema";
import { sampleProviders } from "../client/src/lib/sampleData";

export async function migrateDataToDatabase() {
  const db = await getDb();
  if (!db) {
    console.error('[Migration] Database not available');
    return { success: false, error: 'Database not available' };
  }

  try {
    console.log('[Migration] Starting data migration...');
    
    // Check if data already exists
    const existingProviders = await db.select().from(providers);
    if (existingProviders.length > 0) {
      console.log(`[Migration] Database already contains ${existingProviders.length} providers. Skipping migration.`);
      return { success: true, skipped: true, count: existingProviders.length };
    }

    let providerCount = 0;
    let locationCount = 0;
    let enrollmentCount = 0;

    // Insert each provider with their related data
    for (const provider of sampleProviders) {
      // Insert provider
      await db.insert(providers).values({
        id: provider.id,
        name: provider.name,
        credential: provider.credential,
        npi: provider.npi,
        license: provider.license,
        licenseExpiration: provider.licenseExpiration,
        specialty: provider.specialty,
        status: provider.status,
        flagged: provider.flagged,
        nextCredentialing: provider.nextCredentialing,
      });
      providerCount++;

      // Insert practice locations
      if (provider.practiceLocations && provider.practiceLocations.length > 0) {
        for (const location of provider.practiceLocations) {
          // Map 'additional' to 'secondary' for database compatibility
          const locationType = location.type === 'additional' ? 'secondary' : location.type as 'primary' | 'secondary';
          await db.insert(practiceLocations).values({
            providerId: provider.id,
            type: locationType,
            name: location.name,
          });
          locationCount++;
        }
      }

      // Insert payer enrollments
      if (provider.payerEnrollments && provider.payerEnrollments.length > 0) {
        for (let i = 0; i < provider.payerEnrollments.length; i++) {
          const enrollment = provider.payerEnrollments[i];
          // Generate unique enrollment ID
          const uniqueEnrollmentId = `${provider.id}_enrollment_${i}`;
          await db.insert(payerEnrollments).values({
            id: uniqueEnrollmentId,
            providerId: provider.id,
            payerName: enrollment.payerName,
            status: enrollment.status,
            enrollmentDate: enrollment.enrollmentDate,
            contractEnd: enrollment.contractEnd,
            nextCredentialing: enrollment.nextCredentialing,
            notes: enrollment.notes || null,
          });
          enrollmentCount++;
        }
      }
    }

    console.log(`[Migration] Successfully migrated:`);
    console.log(`  - ${providerCount} providers`);
    console.log(`  - ${locationCount} practice locations`);
    console.log(`  - ${enrollmentCount} payer enrollments`);

    return {
      success: true,
      counts: {
        providers: providerCount,
        locations: locationCount,
        enrollments: enrollmentCount,
      },
    };
  } catch (error) {
    console.error('[Migration] Failed to migrate data:', error);
    return { success: false, error: String(error) };
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDataToDatabase()
    .then((result) => {
      console.log('[Migration] Result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('[Migration] Unexpected error:', error);
      process.exit(1);
    });
}

