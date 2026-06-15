import { db } from "@/db"
import { appointments, AppointmentStatus } from "@/db/schema"
import { TZDate } from "@date-fns/tz"
import { and, gte, lte, inArray, asc } from "drizzle-orm"

export interface AppointmentWithServiceData {
    id: string;
    totalPrice: string;
    startTime: string;
    status: AppointmentStatus;
    serviceNameSnapshot: string | null;
}

export interface IFinanceRepository {
    getRangeData(startDate: TZDate, endDate: TZDate): Promise<AppointmentWithServiceData[]>
}

class FinanceRepository implements IFinanceRepository {
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