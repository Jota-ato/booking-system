import { appointmentStatusEnum } from "@/db/schema"
import { z } from "zod"

export const appointmentStatusSchema = z.enum(appointmentStatusEnum.enumValues);
export type appointmentStatusEnum = z.infer<typeof appointmentStatusSchema>

const baseAppointmentSchema = z.object({
    serviceId: z.uuid(),
    appointmentDate: z.date(),
    startTime: z.string(),
    endTime: z.string()
})

export const updateAppointmentSchema = baseAppointmentSchema.extend({
    status: appointmentStatusSchema,
    extraPrice: z.number()
})

export type UpdateApointmentInput = z.infer<typeof updateAppointmentSchema>