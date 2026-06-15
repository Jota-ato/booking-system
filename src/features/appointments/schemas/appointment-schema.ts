import { appointmentStatusEnum } from "@/db/schema"
import { customerSchema } from "@/features/customers/schemas/customer-schemas";
import { z } from "zod"

export const appointmentStatusSchema = z.enum(appointmentStatusEnum.enumValues);
export type appointmentStatusEnum = z.infer<typeof appointmentStatusSchema>

const validateTimeRange = (data: { startTime: string; endTime: string, appointmentDate: Date }) => {
    const startTime = new Date(data.appointmentDate);
    const endTime = new Date(data.appointmentDate);

    if (data.startTime.includes('T') && data.endTime.includes('T')) {
        const parsedStart = new Date(data.startTime);
        const parsedEnd = new Date(data.endTime);

        return parsedEnd.getTime() > parsedStart.getTime();
    }

    const [startHour, startMinutes] = data.startTime.split(':');
    const [endHour, endMinutes] = data.endTime.split(':');

    startTime.setHours(Number(startHour), Number(startMinutes), 0, 0);
    endTime.setHours(Number(endHour), Number(endMinutes), 0, 0);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return false;
    }

    return endTime > startTime;
};

const timeRangeError = {
    message: "Start hour must be less than the end hour",
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