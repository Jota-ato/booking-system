import { Appointment } from "@/db/schema";
import { FullAppointment } from "@/features/appointments/core/types/appointments.types";

export function getExpectedPaidAppointments(appointments: (FullAppointment | Appointment)[]): {expected: number, paid: number} { 

    const confirmedAppintments = appointments.filter(apt => (apt.status === 'CONFIRMED' || apt.status === 'PAID' || apt.status === 'COMPLETED'));
    const expected = 0
    const paidAppointments = appointments.filter(apt => apt.status === 'PAID');
    const paid = 0

    return {
        expected,
        paid
    }
}