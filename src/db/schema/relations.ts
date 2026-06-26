import { relations } from "drizzle-orm";

import { appointments } from "./appointments";
import { customers } from "./customers";
import { services } from "./services";
import { extras, serviceExtras } from "./extras";
import { appointmentExtras } from "./appoinment-extras";

export const customersRelations = relations(customers, ({ many }) => ({
  appointments: many(appointments),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
  serviceExtras: many(serviceExtras)
}));

export const extrasRelations = relations(extras, ({ many, one }) => ({
  serviceExtras: many(serviceExtras)
}));

export const serviceExtrasRelations = relations(serviceExtras, ({ many, one }) => ({
  extra: one(extras, {
    fields: [serviceExtras.extraId],
    references: [extras.id],
  }),
  service: one(services, {
    fields: [serviceExtras.serviceId],
    references: [services.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  customer: one(customers, {
    fields: [appointments.customerId],
    references: [customers.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
  appoinmentExtras: many(appointmentExtras),
}));

export const appoinmentExtrasRelations = relations(appointmentExtras, ({ one }) => ({
  appointment: one(appointments, {
    fields: [appointmentExtras.appointmentId],
    references: [appointments.id],
  }),
  extra: one(extras, {
    fields: [appointmentExtras.extraId],
    references: [extras.id],
  }),
}));