import { db } from "@/db"
import { appointments, appointmentExtras, AppointmentStatus } from "@/db/schema"
import { TZDate } from "@date-fns/tz"
import { and, gte, lte, inArray, asc, eq, sql } from "drizzle-orm"

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
                startTime: appointments.startTime,
                status: appointments.status,
                serviceNameSnapshot: appointments.serviceNameSnapshot,
                servicePriceSnapshot: appointments.servicePriceSnapshot,
                extrasTotal: sql<string>`COALESCE(SUM(${appointmentExtras.extraPriceSnapshot}), '0')`
            })
            .from(appointments)
            .leftJoin(appointmentExtras, eq(appointments.id, appointmentExtras.appointmentId))
            .where(
                and(
                    inArray(appointments.status, ['PAID', 'CONFIRMED', 'COMPLETED']),
                    gte(appointments.startTime, startDate.toISOString()),
                    lte(appointments.startTime, endDate.toISOString())
                )
            )
            .groupBy(
                appointments.id,
                appointments.startTime,
                appointments.status,
                appointments.serviceNameSnapshot,
                appointments.servicePriceSnapshot
            )
            .orderBy(asc(appointments.startTime));

        return records.map(r => {
            const basePrice = Number(r.servicePriceSnapshot || 0);
            const extrasPrice = Number(r.extrasTotal || 0);
            
            return {
                id: r.id,
                totalPrice: (basePrice + extrasPrice).toString(),
                startTime: r.startTime,
                status: r.status as "PAID" | "CONFIRMED" | 'COMPLETED',
                serviceNameSnapshot: r.serviceNameSnapshot
            };
        });
    }
}

export const financeRepository = new FinanceRepository();