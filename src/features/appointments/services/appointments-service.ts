import { TIMEZONE } from "@/shared/lib/date";
import { appointmentsRepository, IAppointmentsRepository } from "./appointments-repository";
import { TZDate } from "@date-fns/tz"
import { UpdateApointmentInput } from "../schemas/appointment-schema";

class AppointmentsService {
    constructor(
        private appointmentsRepository: IAppointmentsRepository
    ) { }

    async getDayAppointments(day: Date) {
        const startDay = new TZDate(day, TIMEZONE)
        startDay.setHours(0, 0, 0, 0)

        const endDay = new TZDate(day, TIMEZONE)
        endDay.setHours(23, 59, 59, 999)

        return await this.appointmentsRepository.getByDay(startDay, endDay)
    }

    async updateAppointment(data: UpdateApointmentInput, id: string) {
        const appointment = await this.appointmentsRepository.getById(id)

        if (!appointment) throw new Error('Appointment not found')

        await this.appointmentsRepository.update(data, appointment.id)
    }
}

export const appointmentsService = new AppointmentsService(
    appointmentsRepository
)