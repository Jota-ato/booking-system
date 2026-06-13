/**
 * Seed script — run ONCE to create the first admin user.
 *
 * Usage:
 *   npx tsx src/db/seed.ts
 *
 * After running this, the business owner logs in with the same email
 * via Google OAuth. Better Auth will match the email and link the
 * Google account to this user record automatically.
 *
 * DO NOT run this twice for the same email — it will throw a unique
 * constraint error on users.email, which is the correct behavior.
 */

import { auth } from "@/lib/auth";

async function main() {
  const email = "jcesarpro10@gmail.com";
  const name  = "Julio César";

  if (!email || !name) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_NAME in .env.local before running the seed.",
    );
  }

  console.log(`Creating admin user: ${email}`);

  const user = await auth.api.createUser({
    body: {
      name,
      email,
      // Password is set but effectively unused — the owner will sign in
      // with Google, which links to this record via email match.
      // Still required by the API; use a strong random value.
      password: crypto.randomUUID() + crypto.randomUUID(),
      role: "admin",
    },
  });

  console.log("✓ Admin created:", user.user.id);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});