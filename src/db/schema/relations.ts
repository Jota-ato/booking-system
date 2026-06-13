import { relations } from "drizzle-orm";

import { appointments } from "./appointments";
import { customers } from "./customers";
import { services } from "./services";

// ─── Why this file exists ─────────────────────────────────────────────────────
// appointments imports customers + services (for FK references).
// customers and services both need to reference appointments (for `many()`).
// That creates a circular dependency if relations are co-located in each table
// file. Extracting them here breaks the cycle cleanly — a standard Drizzle
// pattern for multi-table schemas.
// See: https://orm.drizzle.team/docs/relations#declaring-relations

// ─── customers ────────────────────────────────────────────────────────────────
export const customersRelations = relations(customers, ({ many }) => ({
  appointments: many(appointments),
}));

// ─── services ─────────────────────────────────────────────────────────────────
export const servicesRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
}));

// ─── appointments ─────────────────────────────────────────────────────────────
export const appointmentsRelations = relations(appointments, ({ one }) => ({
  customer: one(customers, {
    fields: [appointments.customerId],
    references: [customers.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));