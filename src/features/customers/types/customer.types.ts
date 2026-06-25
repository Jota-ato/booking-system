import { Appointment, Customer } from "@/db/schema"

export type CustomerWithAppointments = Customer & {
    appointments: Appointment[]
}

export type CustomerWithAppointmentCount = Customer & {
    appointmentCount: number
}