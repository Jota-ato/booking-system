import { Appointment, Customer, Service } from "@/db/schema";

export type FullAppointment = Appointment & {
    customer: Customer,
    service: Service
}