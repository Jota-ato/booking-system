"use server"
import { BlockTimeInput, blockTimeSchema, NewAppointmentManuallyInput, newAppointmentManuallySchema, UpdateApointmentInput, updateAppointmentSchema } from "../schemas/appointment-schema";
import { adminAction } from "@/shared/lib/actions";
import { appointmentsService } from "../services/appointments-service";

export const updateAppointmentAction = adminAction(async (input: UpdateApointmentInput, appointmentId: string) => {
    const zodResponse = updateAppointmentSchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await appointmentsService.updateAppointment(zodResponse.data, appointmentId);
    return 'Appointment updated successfully';
});

export const deleteAppointmentAction = adminAction(async (id: string) => {
    await appointmentsService.deleteAppointment(id);

    return 'Appointment deleted successfully';
});

export const createManualAppointmentAction = adminAction(async (input: NewAppointmentManuallyInput) => {
    const zodResponse = newAppointmentManuallySchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await appointmentsService.createManualAppointment(zodResponse.data);
    
    return 'Appointment created successfully';
});

export const cancellAllDayAction = adminAction(async (day: Date) => {
    await appointmentsService.cancellAllDayAppointments(day);
    
    return 'All appointments cancelled successfully';
});

export const createTimeBlockAction = adminAction(async (input: BlockTimeInput) => {
    const zodResponse = blockTimeSchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await appointmentsService.createBlockTime(zodResponse.data);
    
    return 'Block time successfully applied';
});