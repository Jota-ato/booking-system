import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Table ───────────────────────────────────────────────────────────────────
// No imports from other schema files here — relations live in relations.ts
// to avoid circular dependency cycles (customers ↔ appointments ↔ services).
export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Current name — mutable. Snapshots on appointments capture the name
    // at booking time so renaming a customer never corrupts history.
    name:  varchar("name",  { length: 100 }).notNull(),

    // Phone is the natural dedup key for service businesses.
    // Stored in E.164 format (+15551234567) for consistency.
    // Validated by Zod (FR-09) before any insert reaches the DB.
    phone: varchar("phone", { length: 30 }).notNull(),

    // Email is optional — not every client of a salon or groomer provides one.
    // Collected when available for future email/SMS reminders (v3 roadmap).
    email: varchar("email", { length: 255 }),

    // ── Audit timestamps ──────────────────────────────────────────
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // One customer record per phone number, enforced at the DB level.
    // The booking API upserts on this key rather than blindly inserting.
    uniqueIndex("uq_customers_phone").on(table.phone),

    // Secondary lookup by email (e.g. for future login / reminder flows).
    index("idx_customers_email").on(table.email),
  ],
);

// ─── Types ───────────────────────────────────────────────────────────────────
export type Customer    = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;