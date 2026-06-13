import { db } from "@/db"
import { TZDate } from "@date-fns/tz"
import { FullAppointment } from "../types/appointments.types"

export interface IAppointmentsRepository {
    getByDay(startDay: TZDate, endDay: TZDate): Promise<FullAppointment[]>
}

class AppointmentsRepository implements IAppointmentsRepository {
    async getByDay(startDay: TZDate, endDay: TZDate): Promise<FullAppointment[]> {
        return await db
            .query
            .appointments
            .findMany({
                where: (apt, { gte, lte, and }) => and(
                    gte(apt.startTime, startDay.toISOString()),
                    lte(apt.startTime, endDay.toISOString())
                ),
                with: {
                    service: true,
                    customer: true
                },
                orderBy: (apt, {desc}) => desc(apt.startTime)
            })
    }
}

export const appointmentsRepository = new AppointmentsRepository()