import { db } from "@/db"
import { appointments, AppointmentStatus } from "@/db/schema"
import { TZDate } from "@date-fns/tz"
import { and, gte, lte, inArray, asc } from "drizzle-orm"

/**
 * Minimal projection of an appointment record used for financial reporting.
 *
 * Contains only the fields required to compute revenue metrics, avoiding
 * the overhead of loading full appointment or service relations.
 */
export interface AppointmentWithServiceData {
    /** Unique identifier of the appointment. */
    id: string;
    /** Total price charged for the appointment, stored as a string decimal. */
    totalPrice: string;
    /** ISO 8601 string representing when the appointment starts. */
    startTime: string;
    /** Current lifecycle status of the appointment. */
    status: AppointmentStatus;
    /**
     * Snapshot of the service name at the time the appointment was created.
     * May be `null` if no snapshot was captured.
     */
    serviceNameSnapshot: string | null;
}

/**
 * Contract for financial data access operations.
 *
 * Implementations must return appointment records within a date range
 * that are relevant for revenue reporting (i.e. `PAID`, `CONFIRMED`, or `COMPLETED`).
 */
export interface IFinanceRepository {
    /**
     * Retrieves appointment records within the specified date range whose status
     * is one of `PAID`, `CONFIRMED`, or `COMPLETED`, ordered by start time ascending.
     *
     * @param startDate - The beginning of the date range (inclusive).
     * @param endDate   - The end of the date range (inclusive).
     * @returns A promise that resolves to an array of {@link AppointmentWithServiceData} projections.
     */
    getRangeData(startDate: TZDate, endDate: TZDate): Promise<AppointmentWithServiceData[]>
}

/**
 * Drizzle ORM–based implementation of {@link IFinanceRepository}.
 *
 * Performs a column-level `SELECT` to avoid loading unnecessary relations,
 * then maps raw records to the {@link AppointmentWithServiceData} shape.
 */
class FinanceRepository implements IFinanceRepository {
    /** @inheritdoc */
    async getRangeData(startDate: TZDate, endDate: TZDate): Promise<AppointmentWithServiceData[]> {
        const records = await db
            .select({
                id: appointments.id,
                totalPrice: appointments.fullPrice,
                startTime: appointments.startTime,
                status: appointments.status,
                serviceNameSnapshot: appointments.serviceNameSnapshot,
                service: appointments.serviceId
            })
            .from(appointments)
            .where(
                and(
                    inArray(appointments.status, ['PAID', 'CONFIRMED', 'COMPLETED']),
                    gte(appointments.startTime, startDate.toISOString()),
                    lte(appointments.startTime, endDate.toISOString())
                )
            )
            .orderBy(asc(appointments.startTime));

        return records.map(r => ({
            id: r.id,
            totalPrice: r.totalPrice,
            startTime: r.startTime,
            status: r.status as "PAID" | "CONFIRMED" | 'COMPLETED',
            serviceNameSnapshot: r.serviceNameSnapshot
        }));
    }
}

export const financeRepository = new FinanceRepository();