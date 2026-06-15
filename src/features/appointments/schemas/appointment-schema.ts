import { appointmentStatusEnum } from "@/db/schema"
import { customerSchema } from "@/features/customers/schemas/customer-schemas";
import { z } from "zod"

export const appointmentStatusSchema = z.enum(appointmentStatusEnum.enumValues);
export type appointmentStatusEnum = z.infer<typeof appointmentStatusSchema>

const validateTimeRange = (data: { startTime: string; endTime: string, appointmentDate: Date }) => {

    const [startHour, startMinutes] = data.startTime.split(':')
    const [endHour, endMinutes] = data.endTime.split(':')

    const startTime = new Date(data.appointmentDate)
    startTime.setHours(+startHour, +startMinutes, 0, 0)
    const endTime = new Date(data.appointmentDate)
    endTime.setHours(+endHour, +endMinutes, 0, 0)

    return endTime > startTime;
};

const timeRangeError = {
    message: "La hora de inicio debe ser menor a la hora de fin",
    path: ["appointmentDate"],
};

const baseAppointmentSchema = z.object({
    serviceId: z.uuid({ error: 'Service is necessary' }),
    appointmentDate: z.date({ error: 'Invalid date' }),
    startTime: z.string(),
    endTime: z.string(),
    extrasPrice: z.number()
})

export const updateAppointmentSchema = baseAppointmentSchema.extend({
    status: appointmentStatusSchema,
}).refine(
    validateTimeRange, timeRangeError
)

export const newAppointmentManuallySchema = z.discriminatedUnion("isRegisterClient", [
    baseAppointmentSchema.extend({
        isRegisterClient: z.literal(true),
        clientPhone: z.string({ error: 'Client phone is neccesary' }).min(10, { message: 'Phone must be at least 10 digits' }),
    }),

    baseAppointmentSchema.extend({
        isRegisterClient: z.literal(false),
        clientPhone: z.string({ error: 'Client phone is neccesary' }).min(10, { message: 'Phone must be at least 10 digits' }),
    }).extend(customerSchema.shape)
]).refine(
    validateTimeRange, timeRangeError
)

export const blockTimeSchema = baseAppointmentSchema.pick({
    appointmentDate: true,
    startTime: true,
    endTime: true
}).refine(
    validateTimeRange, timeRangeError
)

export type NewAppointmentManuallyInput = z.infer<typeof newAppointmentManuallySchema>;
export type UpdateApointmentInput = z.infer<typeof updateAppointmentSchema>
export type BlockTimeInput = z.infer<typeof blockTimeSchema>