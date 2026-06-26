import { appointmentStatusEnum } from "@/db/schema"
import { customerSchema } from "@/features/customers/schemas/customer-schemas";
import { z } from "zod"

export const appointmentStatusSchema = z.enum(appointmentStatusEnum.enumValues);
export type appointmentStatusEnum = z.infer<typeof appointmentStatusSchema>

const validateTimeRange = (data: { startTime: Date; endTime: Date }) => {
    return data.endTime > data.startTime;
}

const timeRangeError = {
    message: "Start hour must be less than the end hour",
    path: ["endTime"],
};

const baseAppointmentSchema = z.object({
    serviceId: z.uuid({ error: 'Service is necessary' }),
    extrasId: z.array(z.uuid().nullable().optional()),
    startTime: z.date(),
    endTime: z.date(),
    adittionalPrice: z.number()
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
    startTime: true,
    endTime: true
}).refine(
    validateTimeRange, timeRangeError
)

export const blockPeriodSchema = z.object({
    startTime: z.date({ error: "Start time is required" }),
    endTime: z.date({ error: "End time is required" })
}).refine(
    validateTimeRange, timeRangeError
)

export type NewAppointmentManuallyInput = z.infer<typeof newAppointmentManuallySchema>;
export type UpdateApointmentInput = z.infer<typeof updateAppointmentSchema>
export type BlockTimeInput = z.infer<typeof blockTimeSchema>
export type BlockPeriodInput = z.infer<typeof blockPeriodSchema>