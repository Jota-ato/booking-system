import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ─── Table ───────────────────────────────────────────────────────────────────
// No imports from other schema files here — relations live in relations.ts
// to avoid circular dependency cycles (customers ↔ appointments ↔ services).
export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // ── Service definition (FR-04) ────────────────────────────────
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    imgage: varchar("image", { length: 120 }),

    // numeric(10,2) avoids float rounding errors on currency values.
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),

    // Duration in minutes — copied into serviceDurationSnapshot at booking
    // time so the slot engine always has the correct value even if the
    // admin later edits the service.
    durationMinutes: integer("duration_minutes").notNull(),

    // Soft-delete: deactivated services disappear from the public booking
    // page (FR-07) but their FK integrity with existing appointments is kept.
    isActive: boolean("is_active").notNull().default(true),

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
    // Public booking page (FR-07) always filters WHERE is_active = true.
    index("idx_services_is_active").on(table.isActive),
  ],
);

// ─── Types ───────────────────────────────────────────────────────────────────
export type Service    = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;