"use server"
import { BlockTimeInput, blockTimeSchema, NewAppointmentManuallyInput, newAppointmentManuallySchema, UpdateApointmentInput, updateAppointmentSchema } from "../schemas/appointment-schema";
import { adminAction } from "@/shared/lib/actions";
import { adminAppointmentsService } from "../services/admin-appointments-service";

/**
 * Updates an existing appointment with the provided information.
 * 
 * @param input - The updated appointment details.
 * @param appointmentId - The unique identifier of the appointment to update.
 * @returns A success message upon successful update.
 * @throws Error if the provided input is invalid.
 */
export const updateAppointmentAction = adminAction(async (input: UpdateApointmentInput, appointmentId: string) => {
    const zodResponse = updateAppointmentSchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await adminAppointmentsService.updateAppointment(zodResponse.data, appointmentId);
    return 'Appointment updated successfully';
});

/**
 * Deletes an appointment by its ID.
 * 
 * @param id - The unique identifier of the appointment to delete.
 * @returns A success message upon successful deletion.
 */
export const deleteAppointmentAction = adminAction(async (id: string, isBlock: boolean = false) => {
    await adminAppointmentsService.deleteAppointment(id);

    return !isBlock ?
        'Appointment deleted successfully'
        : 'Block deleted successfully'
});

/**
 * Creates a new appointment manually.
 * 
 * @param input - The details for the new manual appointment.
 * @returns A success message upon successful creation.
 * @throws Error if the provided input is invalid.
 */
export const createManualAppointmentAction = adminAction(async (input: NewAppointmentManuallyInput) => {
    const zodResponse = newAppointmentManuallySchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await adminAppointmentsService.createManualAppointment(zodResponse.data);

    return 'Appointment created successfully';
});

/**
 * Cancels all appointments for a specific day.
 * 
 * @param day - The date for which to cancel all appointments.
 * @returns A success message upon successful cancellation of all appointments.
 */
export const cancellAllDayAction = adminAction(async (day: Date) => {
    await adminAppointmentsService.cancellAllDayAppointments(day);

    return 'All appointments cancelled successfully';
});

/**
 * Creates a time block to prevent appointments from being scheduled during a specific period.
 * 
 * @param input - The details of the time block to create.
 * @returns A success message upon successful application of the time block.
 * @throws Error if the provided input is invalid.
 */
export const createBlockAction = adminAction(async (input: BlockTimeInput) => {
    const zodResponse = blockTimeSchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await adminAppointmentsService.createBlockTime(zodResponse.data);

    return 'Block successfully applied';
});

export const updateBlockAction = adminAction(async (input: BlockTimeInput, blockId: string) => {
    const zodResponse = blockTimeSchema.safeParse(input);
    if (zodResponse.error) throw new Error("Invalid form attributes.");

    await adminAppointmentsService.updateBlock(zodResponse.data, blockId);

    return 'Block successfully updated';
});