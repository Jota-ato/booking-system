import { appointmentStatusEnum } from "@/db/schema"
import { z } from "zod"

export const appointmentStatusSchema = z.enum(appointmentStatusEnum.enumValues);

const baseAppointmentSchema = z.object({
    serviceId: z.uuid(),
    appointmentDate: z.date(),
    startTime: z.date(),
    endTime: z.date()
})

export const updateAppointmentSchema = baseAppointmentSchema.extend({
    id: z.uuid(),
    status: appointmentStatusSchema
})

export type UpdateApointmentInput = z.infer<typeof updateAppointmentSchema>