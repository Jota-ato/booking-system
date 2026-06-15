import { Appointment } from "@/db/schema";
import { FullAppointment } from "../types/appointments.types";

export function getExpectedPaidAppointments(appointments: (FullAppointment | Appointment)[]): {expected: number, paid: number} { 

    const confirmedAppintments = appointments.filter(apt => (apt.status === 'CONFIRMED' || apt.status === 'PAID'));
    const expected = confirmedAppintments.reduce((acc, apt) => acc + +apt.fullPrice, 0);
    const paidAppointments = appointments.filter(apt => apt.status === 'PAID');
    const paid = paidAppointments.reduce((acc, apt) => acc + +apt.fullPrice, 0);

    return {
        expected,
        paid
    }
}