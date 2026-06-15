import { appointmentStatusEnum } from "@/db/schema"
import { customerSchema } from "@/features/customers/schemas/customer-schemas";
import { z } from "zod"

export const appointmentStatusSchema = z.enum(appointmentStatusEnum.enumValues);
export type appointmentStatusEnum = z.infer<typeof appointmentStatusSchema>

const baseAppointmentSchema = z.object({
    serviceId: z.uuid({error: 'Service is necessary'}),
    appointmentDate: z.date({error: 'Invalid date'}),
    startTime: z.string(),
    endTime: z.string(),
    extrasPrice: z.number()
})

export const updateAppointmentSchema = baseAppointmentSchema.extend({
    status: appointmentStatusSchema,
})



export const newAppointmentManuallySchema = z.discriminatedUnion("isRegisterClient", [
    baseAppointmentSchema.extend({
        isRegisterClient: z.literal(true),
        clientPhone: z.string({error: 'Client phone is neccesary'}).min(10, { message: 'Phone must be at least 10 digits' }),
    }),

    baseAppointmentSchema.extend({
        isRegisterClient: z.literal(false),
        clientPhone: z.string({error: 'Client phone is neccesary'}).min(10, { message: 'Phone must be at least 10 digits' }),
    }).extend(customerSchema.shape)
])

export type NewAppointmentManuallyInput = z.infer<typeof newAppointmentManuallySchema>;

export type UpdateApointmentInput = z.infer<typeof updateAppointmentSchema>