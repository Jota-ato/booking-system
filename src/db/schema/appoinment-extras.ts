import { numeric, pgTable, uuid } from "drizzle-orm/pg-core";
import { extras } from "./extras";
import { appointments } from "./appointments";

export const appointmentExtras = pgTable("appoinment_extras", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    appointmentId: uuid("appointment_id")
        .notNull()
        .references(() => appointments.id, { onDelete: "restrict" }),
    extraId: uuid("extra_id")
        .notNull()
        .references(() => extras.id, { onDelete: "restrict" }),
    extraPriceSnapshot: numeric("extra_price_snapshot", { precision: 10, scale: 2 }).notNull()
})

export type AppointmentExtra = typeof appointmentExtras.$inferSelect;
export type NewAppointmentExtra = typeof appointmentExtras.$inferInsert;