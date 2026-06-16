import { TIMEZONE } from "@/shared/lib/date";
import { appointmentsRepository, IAppointmentsRepository } from "./appointments-repository";
import { TZDate } from "@date-fns/tz"
import { BlockTimeInput, NewAppointmentManuallyInput, UpdateApointmentInput } from "../schemas/appointment-schema";
import { Customer } from "@/db/schema";
import { customersRepository, ICustomersRepository } from "@/features/customers/services/customers-repository";
import { CustomersService, customersService } from "@/features/customers/services/customers-service";
import { AppError } from "@/shared/lib/errors";

class AppointmentsService {
    constructor(
        private appointmentsRepository: IAppointmentsRepository,
        private customersService: CustomersService
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

        if (!appointment) throw new AppError('Appointment not found')

        await this.appointmentsRepository.update(data, appointment.id)
    }

    async deleteAppointment(id: string) {
        const appointment = await this.appointmentsRepository.getById(id)

        if (!appointment) throw new AppError('Appointment not found')

        await this.appointmentsRepository.delete(id)
    }

    async createManualAppointment(data: NewAppointmentManuallyInput) {

        const { appointmentDate, clientPhone, endTime, extrasPrice, isRegisterClient, serviceId, startTime } = data
        let customer: Customer;
        if (isRegisterClient) {
            const dbCustomer = await this.customersService.getClientByPhone(clientPhone)
            if (!dbCustomer) throw new AppError('Client not found')
            customer = dbCustomer
        } else {
            customer = await this.customersService.createClient({
                name: data.clientName,
                lastName: data.clientLastName,
                phone: clientPhone
            })
        }

        await this.appointmentsRepository.createManually({
            appointmentDate,
            customerId: customer.id,
            endTime,
            serviceId,
            startTime,
            extrasPrice: extrasPrice.toString()
        })
    }

    async cancellAllDayAppointments(day: Date) {
        const startDay = new TZDate(day, TIMEZONE)
        startDay.setHours(0, 0, 0, 0)

        const endDay = new TZDate(day, TIMEZONE)
        endDay.setHours(23, 59, 59, 999)

        await this.appointmentsRepository.cancellAllOfDay(startDay, endDay)
    }

    async createBlockTime(data: BlockTimeInput) {
        await this.appointmentsRepository.createBlockTime(data)
    }
}

export const appointmentsService = new AppointmentsService(
    appointmentsRepository,
    customersService
)