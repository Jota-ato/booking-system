import { db } from "@/db"
import { TZDate } from "@date-fns/tz"
import { Appointment, appointments } from "@/db/schema"
import { eq, lte } from "drizzle-orm"
import { FullAppointment } from "../types/appointments.types"
import { TIMEZONE } from "@/shared/lib/date"
import { endOfDay } from "date-fns"

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
    getByRange(startRange: string | Date, endRange: string | Date, excludeId?: string, limit?: number): Promise<Appointment[]>
    getHistory(page: number, dateFilter?: string): Promise<{ data: FullAppointment[], totalPages: number }>
    getFromDay(day: string, full?: boolean): Promise<(FullAppointment | Appointment)[]>
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
                    customer: true,
                    appoinmentExtras: true
                },
                orderBy: (apt, { asc }) => asc(apt.startTime)
            })
    }

    /** @inheritdoc */
    async getByRange(
        startRange: string | Date,
        endRange: string | Date,
        excludeId?: string,
        limit: number = 10
    ): Promise<Appointment[]> {
        const safeStartRange = startRange instanceof Date ? startRange.toISOString() : startRange;
        const safeEndRange = endRange instanceof Date ? endRange.toISOString() : endRange;
        return await db
            .query
            .appointments
            .findMany({
                where: (appointment, { and, lt, gt, not }) => {
                    const conditions = [
                        lt(appointment.startTime, safeEndRange),
                        gt(appointment.endTime, safeStartRange)
                    ];

                    if (excludeId) {
                        conditions.push(not(eq(appointment.id, excludeId)));
                    }

                    return and(...conditions);
                },
                limit,
            });
    }

    async getHistory(page: number, dateFilter?: string): Promise<{ data: FullAppointment[]; totalPages: number }> {
        const ITEMS_PER_PAGE = 5
        const offset = (page - 1) * ITEMS_PER_PAGE
        let cutoff = new Date()
        if (dateFilter) {
            const [year, month, day] = dateFilter.split('-')
            cutoff = new Date(+year, +month - 1, +day)
        }
        cutoff.setHours(23, 59, 59, 999)

        const [data, total] = await Promise.all([
            db
                .query.
                appointments
                .findMany({
                    where: (appointment, { lte }) => lte(appointment.startTime, cutoff.toISOString()),
                    with: {
                        service: true,
                        customer: true,
                        appoinmentExtras: true
                    },
                    orderBy: (apt, { desc }) => desc(apt.startTime),
                    limit: ITEMS_PER_PAGE,
                    offset,
                }),
            db.$count(appointments, lte(appointments.startTime, cutoff.toISOString()))
        ])

        return {
            data,
            totalPages: Math.ceil(total / ITEMS_PER_PAGE)
        }
    }

    async getFromDay(day: string, full: boolean = false): Promise<(FullAppointment | Appointment)[]> {
        return await db
            .query
            .appointments
            .findMany({
                where: (appointment, { gte }) => gte(appointment.startTime, day),
                with: {
                    service: full ? true : undefined,
                    customer: full ? true : undefined,
                    appoinmentExtras: full ? true : undefined
                }
            })
    }
}

export const appointmentsRepository = new AppointmentsRepository()