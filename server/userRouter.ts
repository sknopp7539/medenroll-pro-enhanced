import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "./_core/auth";

export const userRouter = router({
  // Get all users (admin only)
  list: publicProcedure.query(async ({ ctx }) => {
    requireRole(ctx, "admin");
    
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    const allUsers = await db.select({
      openId: users.openId,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      lastSignedIn: users.lastSignedIn,
    }).from(users);
    
    return allUsers;
  }),

  // Get a single user by openId (admin only)
  getById: publicProcedure
    .input(z.object({ openId: z.string() }))
    .query(async ({ input, ctx }) => {
      requireRole(ctx, "admin");
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.openId, input.openId));
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    }),

  // Update user role (admin only)
  updateRole: publicProcedure
    .input(z.object({
      openId: z.string(),
      role: z.enum(['viewer', 'manager', 'admin']),
    }))
    .mutation(async ({ input, ctx }) => {
      requireRole(ctx, "admin");
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Prevent admin from changing their own role
      if (ctx.user?.openId === input.openId) {
        throw new Error('Cannot change your own role');
      }
      
      await db
        .update(users)
        .set({ role: input.role, updatedAt: new Date() })
        .where(eq(users.openId, input.openId));
      
      return { success: true };
    }),

  // Get current user info
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new Error('Not authenticated');
    }
    
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.openId, ctx.user.openId));
    
    return user || null;
  }),
});

