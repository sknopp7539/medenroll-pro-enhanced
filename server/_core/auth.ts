import { TRPCError } from "@trpc/server";
import type { User } from "../../drizzle/schema";

export type UserRole = "viewer" | "manager" | "admin";

export interface AuthContext {
  user: User | null;
}

/**
 * Check if user has required role or higher
 * Role hierarchy: viewer < manager < admin
 */
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 1,
    manager: 2,
    admin: 3,
  };
  
  const userRoleLevel = roleHierarchy[user.role as UserRole] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole];
  
  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Require authentication - throws if user is not logged in
 */
export function requireAuth(ctx: AuthContext): User {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
    });
  }
  return ctx.user;
}

/**
 * Require specific role or higher - throws if user doesn't have permission
 */
export function requireRole(ctx: AuthContext, role: UserRole): User {
  const user = requireAuth(ctx);
  
  if (!hasRole(user, role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `This action requires ${role} role or higher`,
    });
  }
  
  return user;
}

/**
 * Permission definitions for MedEnroll Pro
 */
export const Permissions = {
  // Provider permissions
  VIEW_PROVIDERS: (user: User | null) => hasRole(user, "viewer"),
  CREATE_PROVIDER: (user: User | null) => hasRole(user, "manager"),
  UPDATE_PROVIDER: (user: User | null) => hasRole(user, "manager"),
  DELETE_PROVIDER: (user: User | null) => hasRole(user, "admin"),
  
  // Report permissions
  VIEW_REPORTS: (user: User | null) => hasRole(user, "viewer"),
  EXPORT_REPORTS: (user: User | null) => hasRole(user, "manager"),
  
  // User management permissions
  VIEW_USERS: (user: User | null) => hasRole(user, "admin"),
  MANAGE_USERS: (user: User | null) => hasRole(user, "admin"),
  ASSIGN_ROLES: (user: User | null) => hasRole(user, "admin"),
} as const;

