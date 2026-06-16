"use server"
import { BlockTimeInput, blockTimeSchema, NewAppointmentManuallyInput, newAppointmentManuallySchema, UpdateApointmentInput, updateAppointmentSchema } from "../schemas/appointment-schema";
import { adminAction } from "@/shared/lib/actions";
import { adminAppointmentsService } from "../services/admin-appointments-service";

export const updateAppointmentAction = adminAction(async (input: UpdateApointmentInput, appointmentId: string) => {
    const zodResponse = updateAppointmentSchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await adminAppointmentsService.updateAppointment(zodResponse.data, appointmentId);
    return 'Appointment updated successfully';
});

export const deleteAppointmentAction = adminAction(async (id: string) => {
    await adminAppointmentsService.deleteAppointment(id);

    return 'Appointment deleted successfully';
});

export const createManualAppointmentAction = adminAction(async (input: NewAppointmentManuallyInput) => {
    const zodResponse = newAppointmentManuallySchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await adminAppointmentsService.createManualAppointment(zodResponse.data);
    
    return 'Appointment created successfully';
});

export const cancellAllDayAction = adminAction(async (day: Date) => {
    await adminAppointmentsService.cancellAllDayAppointments(day);
    
    return 'All appointments cancelled successfully';
});

export const createTimeBlockAction = adminAction(async (input: BlockTimeInput) => {
    const zodResponse = blockTimeSchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await adminAppointmentsService.createBlockTime(zodResponse.data);
    
    return 'Block time successfully applied';
});