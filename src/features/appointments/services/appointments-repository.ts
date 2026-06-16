import { db } from "@/db"
import { TZDate } from "@date-fns/tz"
import { FullAppointment } from "../core/types/appointments.types"
import { Appointment } from "@/db/schema"
import { eq } from "drizzle-orm"

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