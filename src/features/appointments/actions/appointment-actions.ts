"use server"
import { requireAuth } from "@/lib/auth-server";
import { NewAppointmentManuallyInput, newAppointmentManuallySchema, UpdateApointmentInput, updateAppointmentSchema } from "../schemas/appointment-schema";
import { ActionResponse } from "@/shared/lib/actions";
import { appointmentsService } from "../services/appointments-service";
import { revalidatePath } from "next/cache";

export async function updateAppointmentAction(input: UpdateApointmentInput, appointmentId: string): ActionResponse {
    const { isAdmin } = await requireAuth()

    if (!isAdmin) {
        return {
            success: false,
            message: "You don't have authorization"
        }
    }

    const zodResponse = updateAppointmentSchema.safeParse(input)

    if (zodResponse.error) {
        return {
            success: false,
            message: 'Something went wrong'
        }
    }

    await appointmentsService.updateAppointment(zodResponse.data, appointmentId)

    revalidatePath('/')

    return {
        success: true,
        message: 'Appointment updated successfully'
    }
}

export async function deleteAppointmentAction(id: string): ActionResponse {
    const { isAdmin } = await requireAuth()

    if (!isAdmin) {
        return {
            success: false,
            message: "You don't have authorization"
        }
    }

    await appointmentsService.deleteAppointment(id)
    revalidatePath('/')

    return {
        success: true,
        message: 'Appointment deleted successfully'
    }
}
/**
 * Creates a new appointment manually.
 *
 * This action requires administrative privileges. It validates the provided input against
 * the manual appointment schema, creates the appointment record, and revalidates the home path.
 *
 * @param input - The data for the new manual appointment.
 * @returns An ActionResponse indicating the success or failure of the operation.
 */
export async function createManualAppointmentAction(input: NewAppointmentManuallyInput): ActionResponse {

    const { isAdmin } = await requireAuth()

    if (!isAdmin) {
        return {
            success: false,
            message: "You don't have authorization"
        }
    }

    const zodResponse = newAppointmentManuallySchema.safeParse(input)

    if (zodResponse.error) {
        return {
            success: false,
            message: 'something went wrong'
        }
    }

    await appointmentsService.createManualAppointment(zodResponse.data)
    revalidatePath('/')

    return {
        success: true,
        message: 'Appointment created successfully'
    }
}

export async function cancellAllDayAction(day: Date): ActionResponse {
    const { isAdmin } = await requireAuth()

    if (!isAdmin) {
        return {
            success: false,
            message: "You don't have authorization"
        }
    }

    await appointmentsService.cancellAllDayAppointments(day)

    revalidatePath('/')

    return {
        success: true,
        message: 'All appointments cancelled successfully'
    }
}