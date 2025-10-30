import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { providers, practiceLocations, payerEnrollments } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "./_core/auth";

// Validation schemas
const providerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  credential: z.string().min(1),
  npi: z.string().min(1),
  license: z.string().default(''),
  licenseExpiration: z.string().default(''),
  specialty: z.string().min(1),
  status: z.enum(['active', 'pending', 'inactive']),
  flagged: z.boolean().default(false),
  nextCredentialing: z.string().default(''),
  hireDate: z.string().nullable().optional(),
  terminationDate: z.string().nullable().optional(),
  terminationReason: z.string().nullable().optional(),
});

const practiceLocationSchema = z.object({
  id: z.number().optional(),
  type: z.enum(['primary', 'secondary']),
  name: z.string().min(1),
});

const payerEnrollmentSchema = z.object({
  id: z.string(),
  payerName: z.string().min(1),
  status: z.enum(['active', 'pending', 'inactive']),
  enrollmentDate: z.string().default(''),
  contractEnd: z.string().default(''),
  nextCredentialing: z.string().default(''),
  notes: z.string().nullable().default(''),
});

export const providerRouter = router({
  // Get all providers with their related data
  // Requires: viewer role or higher
  list: publicProcedure.query(async ({ ctx }) => {
    requireRole(ctx, "viewer");
    
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    const allProviders = await db.select().from(providers);
    
    // Fetch related data for each provider
    const providersWithRelations = await Promise.all(
      allProviders.map(async (provider: typeof providers.$inferSelect) => {
        const locations = await db
          .select()
          .from(practiceLocations)
          .where(eq(practiceLocations.providerId, provider.id));
        
        const enrollments = await db
          .select()
          .from(payerEnrollments)
          .where(eq(payerEnrollments.providerId, provider.id));
        
        return {
          ...provider,
          practiceLocations: locations,
          payerEnrollments: enrollments,
        };
      })
    );
    
    return providersWithRelations;
  }),

  // Get a single provider by ID
  // Requires: viewer role or higher
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      requireRole(ctx, "viewer");
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const [provider] = await db
        .select()
        .from(providers)
        .where(eq(providers.id, input.id));
      
      if (!provider) {
        throw new Error('Provider not found');
      }
      
      const locations = await db
        .select()
        .from(practiceLocations)
        .where(eq(practiceLocations.providerId, provider.id));
      
      const enrollments = await db
        .select()
        .from(payerEnrollments)
        .where(eq(payerEnrollments.providerId, provider.id));
      
      return {
        ...provider,
        practiceLocations: locations,
        payerEnrollments: enrollments,
      };
    }),

  // Create a new provider
  // Requires: manager role or higher
  create: publicProcedure
    .input(z.object({
      provider: providerSchema,
      practiceLocations: z.array(practiceLocationSchema),
      payerEnrollments: z.array(payerEnrollmentSchema),
    }))
    .mutation(async ({ input, ctx }) => {
      requireRole(ctx, "manager");
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Insert provider
      await db.insert(providers).values(input.provider);
      
      // Insert practice locations
      if (input.practiceLocations.length > 0) {
        await db.insert(practiceLocations).values(
          input.practiceLocations.map(loc => ({
            providerId: input.provider.id,
            type: loc.type,
            name: loc.name,
          }))
        );
      }
      
      // Insert payer enrollments
      if (input.payerEnrollments.length > 0) {
        await db.insert(payerEnrollments).values(
          input.payerEnrollments.map(enrollment => ({
            ...enrollment,
            providerId: input.provider.id,
          }))
        );
      }
      
      // Fetch the created provider with relations
      const [createdProvider] = await db
        .select()
        .from(providers)
        .where(eq(providers.id, input.provider.id));
      
      const locations = await db
        .select()
        .from(practiceLocations)
        .where(eq(practiceLocations.providerId, input.provider.id));
      
      const enrollments = await db
        .select()
        .from(payerEnrollments)
        .where(eq(payerEnrollments.providerId, input.provider.id));
      
      return {
        provider: createdProvider,
        practiceLocations: locations,
        payerEnrollments: enrollments,
      };
    }),

  // Update an existing provider
  // Requires: manager role or higher
  update: publicProcedure
    .input(z.object({
      provider: providerSchema,
      practiceLocations: z.array(practiceLocationSchema),
      payerEnrollments: z.array(payerEnrollmentSchema),
    }))
    .mutation(async ({ input, ctx }) => {
      requireRole(ctx, "manager");
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Update provider
      await db
        .update(providers)
        .set(input.provider)
        .where(eq(providers.id, input.provider.id));
      
      // Delete and recreate practice locations
      await db
        .delete(practiceLocations)
        .where(eq(practiceLocations.providerId, input.provider.id));
      
      if (input.practiceLocations.length > 0) {
        await db.insert(practiceLocations).values(
          input.practiceLocations.map(loc => ({
            providerId: input.provider.id,
            type: loc.type,
            name: loc.name,
          }))
        );
      }
      
      // Delete and recreate payer enrollments
      await db
        .delete(payerEnrollments)
        .where(eq(payerEnrollments.providerId, input.provider.id));
      
      if (input.payerEnrollments.length > 0) {
        await db.insert(payerEnrollments).values(
          input.payerEnrollments.map(enrollment => ({
            ...enrollment,
            providerId: input.provider.id,
          }))
        );
      }
      
      return { success: true };
    }),

  // Delete a provider and all related data
  // Requires: admin role
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      requireRole(ctx, "admin");
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Delete practice locations
      await db
        .delete(practiceLocations)
        .where(eq(practiceLocations.providerId, input.id));
      
      // Delete payer enrollments
      await db
        .delete(payerEnrollments)
        .where(eq(payerEnrollments.providerId, input.id));
      
      // Delete provider
      await db
        .delete(providers)
        .where(eq(providers.id, input.id));
      
      return { success: true };
    }),

  // Update a single payer enrollment
  // Requires: manager role or higher
  updateEnrollment: publicProcedure
    .input(z.object({
      id: z.string(),
      enrollment: payerEnrollmentSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireRole(ctx, "manager");
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      await db
        .update(payerEnrollments)
        .set(input.enrollment)
        .where(eq(payerEnrollments.id, input.id));
      
      return { success: true };
    }),

  // Terminate a provider
  // Requires: manager role or higher
  terminate: publicProcedure
    .input(z.object({
      id: z.string(),
      terminationDate: z.string(),
      terminationReason: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      requireRole(ctx, "manager");
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Update provider with termination info and set status to inactive
      await db
        .update(providers)
        .set({
          status: 'inactive',
          terminationDate: input.terminationDate,
          terminationReason: input.terminationReason || null,
        })
        .where(eq(providers.id, input.id));
      
      return { success: true };
    }),

  // Reactivate a terminated provider
  // Requires: admin role
  reactivate: publicProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['active', 'pending']),
    }))
    .mutation(async ({ input, ctx }) => {
      requireRole(ctx, "admin");
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Clear termination info and set new status
      await db
        .update(providers)
        .set({
          status: input.status,
          terminationDate: null,
          terminationReason: null,
        })
        .where(eq(providers.id, input.id));
      
      return { success: true };
    }),
});

