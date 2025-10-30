import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["viewer", "manager", "admin"]).default("viewer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Providers table - stores healthcare provider information
 */
export const providers = mysqlTable("providers", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  credential: varchar("credential", { length: 50 }).notNull(),
  npi: varchar("npi", { length: 20 }).notNull(),
  license: varchar("license", { length: 100 }).notNull().default(''),
  licenseExpiration: varchar("licenseExpiration", { length: 20 }).notNull().default(''),
  specialty: varchar("specialty", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["active", "pending", "inactive"]).notNull().default("pending"),
  flagged: boolean("flagged").notNull().default(false),
  nextCredentialing: varchar("nextCredentialing", { length: 20 }).notNull().default(''),
  hireDate: varchar("hireDate", { length: 20 }),
  terminationDate: varchar("terminationDate", { length: 20 }),
  terminationReason: text("terminationReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Provider = typeof providers.$inferSelect;
export type InsertProvider = typeof providers.$inferInsert;

/**
 * Practice locations table - stores provider practice locations
 */
export const practiceLocations = mysqlTable("practiceLocations", {
  id: int("id").autoincrement().primaryKey(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["primary", "secondary"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PracticeLocation = typeof practiceLocations.$inferSelect;
export type InsertPracticeLocation = typeof practiceLocations.$inferInsert;

/**
 * Payer enrollments table - stores provider payer enrollment information
 */
export const payerEnrollments = mysqlTable("payerEnrollments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  payerName: varchar("payerName", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["active", "pending", "inactive"]).notNull().default("pending"),
  enrollmentDate: varchar("enrollmentDate", { length: 20 }).notNull().default(''),
  contractEnd: varchar("contractEnd", { length: 20 }).notNull().default(''),
  nextCredentialing: varchar("nextCredentialing", { length: 20 }).notNull().default(''),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PayerEnrollment = typeof payerEnrollments.$inferSelect;
export type InsertPayerEnrollment = typeof payerEnrollments.$inferInsert;