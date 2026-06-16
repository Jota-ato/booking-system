import { db } from "@/db"
import { TZDate } from "@date-fns/tz"
import { FullAppointment } from "../types/appointments.types"
import { BlockTimeInput, UpdateApointmentInput } from "../schemas/appointment-schema"
import { Appointment, appointments, NewAppointment } from "@/db/schema"
import { and, eq, gte, lte, not } from "drizzle-orm"

/**
 * Contract for all appointment persistence operations.
 *
 * Implementations must handle reading, writing, updating, and
 * deleting appointment records, as well as range-based collision
 * detection and bulk status updates.
 */
export interface IAppointmentsRepository {
    /**
     * Retrieves all appointments whose start time falls within a given day window,
     * including their related service and customer data.
     *
     * @param startDay - The beginning of the day range (inclusive).
     * @param endDay   - The end of the day range (inclusive).
     * @returns A promise that resolves to an array of full appointment records,
     *          ordered by start time ascending.
     */
    getByDay(startDay: TZDate, endDay: TZDate): Promise<FullAppointment[]>

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
     * @param id   - The UUID of the appointment to update.
     * @returns A promise that resolves when the update is complete.
     */
    update(data: UpdateApointmentInput, id: string): Promise<void>

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

    /**
     * Returns all appointments that overlap with the specified time range.
     * Used for collision detection before creating or updating appointments.
     *
     * An appointment overlaps if its start time is before `endRange` AND
     * its end time is after `startRange`.
     *
     * @param startRange - ISO 8601 string representing the start of the range.
     * @param endRange   - ISO 8601 string representing the end of the range.
     * @param excludeId  - Optional UUID of an appointment to exclude from results
     *                     (useful when updating an existing appointment).
     * @returns A promise that resolves to an array of overlapping appointments.
     */
    getByRange(startRange: string, endRange: string, excludeId?: string): Promise<Appointment[]>
}

/**
 * Drizzle ORM–based implementation of {@link IAppointmentsRepository}.
 *
 * All database interactions are performed through the shared `db` instance.
 */
class AppointmentsRepository implements IAppointmentsRepository {
    /** @inheritdoc */
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
                    serviceId: "388308b9-56aa-4bf9-b86b-b6be42222660",
                    customerId: '4da3ada8-9960-45d9-86fa-1498bfcb3584'
                }
            )
    }

    /** @inheritdoc */
    async getByRange(startRange: string, endRange: string, excludeId?: string): Promise<Appointment[]> {
        return await db
            .query
            .appointments
            .findMany({
                where: (appointment, { and, lt, gt, not }) => {
                    const conditions = [
                        lt(appointment.startTime, endRange),
                        gt(appointment.endTime, startRange)
                    ];

                    if (excludeId) {
                        conditions.push(not(eq(appointment.id, excludeId)));
                    }

                    return and(...conditions);
                }
            });
    }
}

export const appointmentsRepository = new AppointmentsRepository()