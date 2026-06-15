import { appointmentStatusEnum } from "@/db/schema"
import { z } from "zod"

export const appointmentStatusSchema = z.enum(appointmentStatusEnum.enumValues);
export type appointmentStatusEnum = z.infer<typeof appointmentStatusSchema>

const baseAppointmentSchema = z.object({
    serviceId: z.uuid({error: 'Service is necessary'}),
    appointmentDate: z.date({error: 'Invalid date'}),
    startTime: z.string(),
    endTime: z.string(),
    extraPrice: z.number()
})

export const updateAppointmentSchema = baseAppointmentSchema.extend({
    status: appointmentStatusSchema,
})

const clientSchema = z.object({
    clientName: z.string().min(2, { message: 'Client name is necessary' }),
    clientLastName: z.string().min(2, { message: 'Client last name is necessary' }),
});

export const newAppointmentManuallySchema = z.discriminatedUnion("isRegisterClient", [
    baseAppointmentSchema.extend({
        isRegisterClient: z.literal(true),
        clientPhone: z.string({error: 'Client phone is neccesary'}).min(10, { message: 'Phone must be at least 10 digits' }),
    }),

    baseAppointmentSchema.extend({
        isRegisterClient: z.literal(false),
        clientPhone: z.string({error: 'Client phone is neccesary'}).min(10, { message: 'Phone must be at least 10 digits' }),
    }).extend(clientSchema.shape)
])

export type NewAppointmentManuallyInput = z.infer<typeof newAppointmentManuallySchema>;

export type UpdateApointmentInput = z.infer<typeof updateAppointmentSchema>