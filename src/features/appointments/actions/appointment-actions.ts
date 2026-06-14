"use server"
import { requireAuth } from "@/lib/auth-server";
import { UpdateApointmentInput, updateAppointmentSchema } from "../schemas/appointment-schema";
import { ActionResponse } from "@/shared/lib/actions";
import { appointmentsService } from "../services/appointments-service";
import { revalidatePath } from "next/cache";

export async function updateAppointmentAction(input: UpdateApointmentInput, appointmentId: string): ActionResponse {
    const { isAdmin } = await requireAuth()

    if (!isAdmin) {
        return {
            success: false,
            message: "you don't have authorization"
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