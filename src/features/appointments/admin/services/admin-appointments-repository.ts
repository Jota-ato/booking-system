import { Appointment, appointments, NewAppointment } from "@/db/schema"
import { BlockTimeInput, UpdateApointmentInput } from "../schemas/appointment-schema"
import { TZDate } from "@date-fns/tz"
import { db } from "@/db"
import { and, count, eq, gte, lte, not, sql } from "drizzle-orm"

export interface IAdminAppointmentsRepository {
    /*
     * @param id   - The UUID of the appointment to update.
     * @returns A promise that resolves when the update is complete.
     */
    update(data: UpdateApointmentInput, id: string): Promise<void>
    /**
     * Retrieves a single appointment by its unique identifier.
     *
     * @param id - The UUID of the appointment.
     * @returns A promise that resolves to the appointment record, or `undefined`
     *          if no matching record is found.
     */
    getById(id: string): Promise<Appointment | undefined>

    /**
     * Updates an existing appointment with the provided data.
     *
     * @param data - The fields to update, conforming to `UpdateApointmentInput`.
 
    /**
     * Permanently deletes an appointment by its unique identifier.
     *
     * @param id - The UUID of the appointment to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(id: string): Promise<void>

    /**
     * Creates a blocked time slot in the appointments table.
     * Uses fixed system-level service and customer IDs to mark the slot as unavailable.
     *
     * @param data - The block time details, conforming to `BlockTimeInput`.
     * @returns A promise that resolves when the record has been inserted.
     */
    createBlockTime(data: BlockTimeInput): Promise<void>

    /**
     * Cancels all appointments within a given day that are not already
     * in a terminal state (`PAID` or `COMPLETED`).
     *
     * @param startDay - The beginning of the day range (inclusive).
     * @param endDay   - The end of the day range (inclusive).
     * @returns A promise that resolves when all eligible appointments have been cancelled.
     */
    cancellAllOfDay(startDay: TZDate, endDay: TZDate): Promise<void>

    /**
     * Inserts a new appointment record directly using a pre-built `NewAppointment` object.
     * Intended for manual appointment creation flows.
     *
     * @param data - The full appointment data conforming to `NewAppointment`.
     * @returns A promise that resolves when the record has been inserted.
     */
    createManually(data: NewAppointment): Promise<void>
    updateBlock(data: BlockTimeInput, id: string): Promise<void>
    getNoShowRate(startRange?: string, endRange?: string): Promise<number>
}

class AdminAppointmentsRepository implements IAdminAppointmentsRepository {
    /** @inheritdoc */
    async getById(id: string): Promise<Appointment | undefined> {
        return await db
            .query
            .appointments
            .findFirst({
                where: (appointment, { eq }) => eq(appointment.id, id)
            })
    }

    /** @inheritdoc */
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

    /** @inheritdoc */
    async delete(id: string): Promise<void> {
        await db
            .delete(appointments)
            .where(eq(appointments.id, id))
    }

    /** @inheritdoc */
    async createManually(data: NewAppointment): Promise<void> {
        await db
            .insert(appointments)
            .values(data)
    }

    /** @inheritdoc */
    async cancellAllOfDay(startDay: TZDate, endDay: TZDate): Promise<void> {
        await db
            .update(appointments)
            .set({
                status: 'CANCELLED'
            })
            .where(and(
                gte(appointments.startTime, startDay.toISOString()),
                lte(appointments.startTime, endDay.toISOString()),
                not(eq(appointments.status, 'PAID')),
                not(eq(appointments.status, 'COMPLETED'))
            ))
    }

    /** @inheritdoc */
    async createBlockTime(data: BlockTimeInput): Promise<void> {
        await db
            .insert(appointments)
            .values(
                {
                    ...data,
                    serviceId: "5a77e275-3ffa-4e21-834b-1f017fe10eae",
                    customerId: 'caefa19f-5766-4244-8213-b9c969da4e68',
                    status: 'NO_SHOW',
                }
            )
    }

    async updateBlock(data: BlockTimeInput, id: string): Promise<void> {
        await db
            .update(appointments)
            .set({
                ...data
            })
            .where(eq(appointments.id, id))
    }

    async getNoShowRate(startRange?: string, endRange?: string): Promise<number> {
        if (!startRange || !endRange) {
            const [result] = await db
                .select({
                    total: count(),
                    noShows: count(sql`CASE WHEN ${appointments.status} = 'NO_SHOW' THEN 1 END`)
                })
                .from(appointments)
            return (result.noShows / result.total) * 100
        }

        const [result] = await db
                .select({
                    total: count(),
                    noShows: count(sql`CASE WHEN ${appointments.status} = 'NO_SHOW' THEN 1 END`)
                })
                .from(appointments)
                .where(and(
                    gte(appointments.startTime, startRange),
                    lte(appointments.startTime, endRange)
                ))
            return (result.noShows / result.total) * 100
    }
}

export const adminAppointmentsRepository = new AdminAppointmentsRepository()