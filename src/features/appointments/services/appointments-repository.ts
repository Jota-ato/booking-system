import { db } from "@/db"
import { TZDate } from "@date-fns/tz"
import { FullAppointment } from "../types/appointments.types"
import { UpdateApointmentInput } from "../schemas/appointment-schema"
import { Appointment, appointments, NewAppointment } from "@/db/schema"
import { eq } from "drizzle-orm"

export interface IAppointmentsRepository {
    getByDay(startDay: TZDate, endDay: TZDate): Promise<FullAppointment[]>
    getById(id: string): Promise<Appointment | undefined>
    update(data: UpdateApointmentInput, id: string): Promise<void>
    delete(id: string): Promise<void>
    createManually(data: NewAppointment): Promise<void>
}

class AppointmentsRepository implements IAppointmentsRepository {
    async getByDay(startDay: TZDate, endDay: TZDate): Promise<FullAppointment[]> {
        return await db
            .query
            .appointments
            .findMany({
                where: (appointment, { gte, lte, and }) => and(
                    gte(appointment.startTime, startDay.toISOString()),
                    lte(appointment.startTime, endDay.toISOString())
                ),
                with: {
                    service: true,
                    customer: true
                },
                orderBy: (apt, { asc }) => asc(apt.startTime)
            })
    }

    async getById(id: string): Promise<Appointment | undefined> {
        return await db
            .query
            .appointments
            .findFirst({
                where: (appointment, { eq }) => eq(appointment.id, id)
            })
    }

    async update(data: UpdateApointmentInput, id: string): Promise<void> {
        await db
        .update(appointments)
        .set({
            ...data,
            extrasPrice: data.extrasPrice.toString(),
            startTime: data.startTime,
            endTime: data.endTime
        })
        .where(eq(appointments.id, id))
    }

    async delete(id: string): Promise<void> {
        await db
            .delete(appointments)
            .where(eq(appointments.id, id))
    }

    async createManually(data: NewAppointment): Promise<void> {
        await db
            .insert(appointments)
            .values(data)
    }
}

export const appointmentsRepository = new AppointmentsRepository()