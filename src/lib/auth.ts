import 'dotenv/config'
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js"
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    // Map Better Auth's internal table names to your Drizzle schema objects.
    // Required because the CLI-generated file uses the same names, but Better
    // Auth needs an explicit reference when using the drizzle adapter.
    schema: {
      user:         schema.users,
      session:      schema.sessions,
      account:      schema.accounts,
      verification: schema.verifications,
    },
  }),

  socialProviders: {
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  session: {
    // Sliding session: extends expiry on each active request.
    // 30-day max, 1-day extension window.
    expiresIn:          60 * 60 * 24 * 30,
    updateAge:          60 * 60 * 24,
    cookieCache: {
      enabled:   true,
      maxAge:    60 * 5, // 5-minute client cache avoids a DB hit on every render
    },
  },

  plugins: [
    admin({
      // Any email that signs in via Google will land as "user" by default.
      // The only way to become "admin" is via the seed script or a manual
      // DB update — never via the client.
      defaultRole: "user",
    }),
    nextCookies()
  ],
});

// Export the type so you get full autocomplete on session.user everywhere.
export type Auth    = typeof auth;
export type Session = typeof auth.$Infer.Session;