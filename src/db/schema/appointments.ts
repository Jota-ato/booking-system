import {
  index,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { customers } from "./customers";
import { services } from "./services";

// ─── Enum ────────────────────────────────────────────────────────────────────
// FR-05: Admin can move an appointment through these four lifecycle states.
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",    // Default on creation — awaiting admin confirmation
  "CONFIRMED",  // Admin confirmed via dashboard or WhatsApp bridge
  "COMPLETED",  // Appointment has taken place
  "PAID",       // Payment received (can be after COMPLETED)
  "CANCELLED",  // Cancelled by admin or customer
]);

// ─── Table ───────────────────────────────────────────────────────────────────
export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // ── Normalized foreign keys ────────────────────────────────────
    // RESTRICT prevents deleting a customer or service that still has
    // appointment rows — you deactivate, you don't delete.
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),

    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "restrict" }),

    // ── Point-in-time snapshots ────────────────────────────────────
    // Capture the live values at the moment of booking so that:
    //   • Renaming a customer never rewrites past records.
    //   • Changing a service price doesn't alter what was charged.
    //   • Dashboard list views render without any joins.
    customerNameSnapshot: varchar("customer_name_snapshot", { length: 100 }).notNull(),

    serviceNameSnapshot: varchar("service_name_snapshot", { length: 100 }).notNull(),
    servicePriceSnapshot: numeric("service_price_snapshot", { precision: 10, scale: 2 }).notNull(),

    // ── Scheduling ────────────────────────────────────────────────
    // appointmentDate is a separate column so the slot engine (FR-08)
    // can query by day with a simple equality check instead of DATE().
    // startTime / endTime are pre-computed from serviceDurationSnapshot
    // at booking time — collision queries never need to re-join services.
    appointmentDate: timestamp("appointment_date", {
      withTimezone: true,
      mode: "date",
    }).notNull(),

    startTime: timestamp("start_time", {
      withTimezone: true,
      mode: "string",
    }).notNull(),

    endTime: timestamp("end_time", {
      withTimezone: true,
      mode: "string",
    }).notNull(),

    // ── Lifecycle ─────────────────────────────────────────────────
    status: appointmentStatusEnum("status").notNull().default("PENDING"),

    // ── Audit timestamps ──────────────────────────────────────────
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    extrasPrice: numeric('extras_price', { precision: 10, scale: 2 }).notNull().default('0'),
    fullPrice: numeric('full_price', { precision: 10, scale: 2 }).notNull().default('0')
  },
  (table) => [
    // Slot collision engine (FR-08): primary lookup is always by date.
    index("idx_appointments_date").on(table.appointmentDate),

    // Dashboard (FR-03/05): constant filtering by status.
    index("idx_appointments_status").on(table.status),

    // Reverse lookup: all appointments for a given customer (history view).
    index("idx_appointments_customer_id").on(table.customerId),

    // Reverse lookup: all appointments for a given service (analytics).
    index("idx_appointments_service_id").on(table.serviceId),

    // Composite: the slot engine's exact query pattern —
    // WHERE appointment_date = $1 AND status IN ('PENDING', 'CONFIRMED')
    index("idx_appointments_date_status").on(
      table.appointmentDate,
      table.status,
    ),
  ],
);

// ─── Types ───────────────────────────────────────────────────────────────────
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type AppointmentStatus = (typeof appointmentStatusEnum.enumValues)[number];