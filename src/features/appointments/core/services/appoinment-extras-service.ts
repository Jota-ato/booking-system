import { NewAppointmentExtra } from "@/db/schema/appoinment-extras"
import { appointmentExtrasRepository, IAppointmentExtrasRepository } from "./appoinment-extras-repository"
import { extrasRepository, IExtrasRepository } from "@/features/services/services/extras-repository"
import { AppError } from "@/shared/lib/errors"
import { adminAppointmentsRepository, IAdminAppointmentsRepository } from "../../admin/services/admin-appointments-repository"
import { Extra } from "@/db/schema"

class AppointmentExtrasService {
    constructor(
        private appointmentExtrasRepository: IAppointmentExtrasRepository,
        private extrasRepository: IExtrasRepository,
        private adminAppointmentsRepository: IAdminAppointmentsRepository
    ) { }

    async insertAppointmentExtras(appoinmentId: string, extrasId: string[]): Promise<void> {

        const extras = await Promise.all(
            extrasId.map((id) => this.extrasRepository.getExtraById(id))
        )

        if (!extras.every((e): e is Extra => e !== undefined))
            throw new AppError("Extras not found")


        const dbAppoinment = await this.adminAppointmentsRepository.getById(appoinmentId)

        if (!dbAppoinment)
            throw new AppError("Appointment not found")

        const data: NewAppointmentExtra[] = extras.map((extra) => ({
            appointmentId: dbAppoinment.id,
            extraId: extra.id,
            extraPriceSnapshot: extra.price
        }))

        await this.appointmentExtrasRepository.insert(data)
    }
}

export const appointmentExtrasService = new AppointmentExtrasService(
    appointmentExtrasRepository,
    extrasRepository,
    adminAppointmentsRepository
)