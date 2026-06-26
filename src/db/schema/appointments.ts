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

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",    // Default on creation — awaiting admin confirmation
  "CONFIRMED",  // Admin confirmed via dashboard or WhatsApp bridge
  "COMPLETED",  // Appointment has taken place
  "PAID",       // Payment received (can be after COMPLETED)
  "CANCELLED",  // Cancelled by admin or customer,
  "NO_SHOW",    // No show for this customer
  "BLOCKED",    // Blocked by admin
]);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),

    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "restrict" }),
    customerNameSnapshot: varchar("customer_name_snapshot", { length: 100 }),

    serviceNameSnapshot: varchar("service_name_snapshot", { length: 100 }),
    servicePriceSnapshot: numeric("service_price_snapshot", { precision: 10, scale: 2 }),
    startTime: timestamp("start_time", {
      withTimezone: true,
      mode: "string",
    }).notNull(),

    endTime: timestamp("end_time", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    status: appointmentStatusEnum("status").notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    adittionalPrice: numeric('adittional_price', { precision: 10, scale: 2 }).notNull().default('0'),
  },
  (table) => [
    index("idx_appointments_status").on(table.status),
    index("idx_appointments_customer_id").on(table.customerId),
    index("idx_appointments_service_id").on(table.serviceId),
    index("idx_appointments_date_status").on(
      table.status,
    ),
  ],
);

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type AppointmentStatus = (typeof appointmentStatusEnum.enumValues)[number];