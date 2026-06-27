import { Appointment, Customer } from "@/db/schema"
import { FullAppointment } from "@/features/appointments/core/types/appointments.types"

export type CustomerWithAppointments = Customer & {
    appointments: Appointment[]
}

export type CustomerWithAppointmentCount = Customer & {
    appointmentCount: number
}

export type FullCustomer = Customer & {
    appointments: Omit<FullAppointment, "customer">[]
}