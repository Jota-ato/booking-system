import { db } from "@/db"
import { appointmentExtras, NewAppointmentExtra } from "@/db/schema/appoinment-extras"

export interface IAppointmentExtrasRepository {
    insert(data: NewAppointmentExtra[] | NewAppointmentExtra): Promise<void>
}

class AppointmentExtrasRepository implements IAppointmentExtrasRepository {
    async insert(data: NewAppointmentExtra[] | NewAppointmentExtra): Promise<void> {
        const values = Array.isArray(data) ? data : [data];
        await db
            .insert(appointmentExtras)
            .values(values)
    }
}

export const appointmentExtrasRepository = new AppointmentExtrasRepository()