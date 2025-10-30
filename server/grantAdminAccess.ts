import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const OWNER_OPEN_ID = process.env.OWNER_OPEN_ID;

async function grantAdminAccess() {
  if (!OWNER_OPEN_ID) {
    console.error("OWNER_OPEN_ID environment variable not set");
    process.exit(1);
  }

  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  try {
    // Update owner to admin role
    const result = await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.openId, OWNER_OPEN_ID));

    console.log(`✅ Successfully granted admin role to owner (${OWNER_OPEN_ID})`);
    
    // Verify the update
    const [owner] = await db
      .select()
      .from(users)
      .where(eq(users.openId, OWNER_OPEN_ID));

    if (owner) {
      console.log(`✅ Owner role confirmed: ${owner.role}`);
      console.log(`   Name: ${owner.name || 'N/A'}`);
      console.log(`   Email: ${owner.email || 'N/A'}`);
    } else {
      console.log(`⚠️  Owner not found in database. They need to log in first.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error granting admin access:", error);
    process.exit(1);
  }
}

grantAdminAccess();

