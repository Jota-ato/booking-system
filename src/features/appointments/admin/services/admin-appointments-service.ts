import { AppError } from "@/shared/lib/errors";
import { BlockTimeInput, NewAppointmentManuallyInput, UpdateApointmentInput } from "../schemas/appointment-schema";
import { adminAppointmentsRepository, IAdminAppointmentsRepository } from "./admin-appointments-repository";
import { Customer } from "@/db/schema";
import { customersService, CustomersService } from "@/features/customers/services/customers-service";
import { TZDate } from "@date-fns/tz";
import { TIMEZONE } from "@/shared/lib/date";
import { appointmentsService } from "../../core/services/appointments-service";
import { appointmentExtrasService } from "../../core/services/appoinment-extras-service";

class AdminAppointmentsService {
    constructor(
        private adminAppointmentsRepository: IAdminAppointmentsRepository,
        private customersService: CustomersService
    ) { }

    /**
 * Updates an existing appointment after verifying it exists and that
 * the new time slot does not overlap with any other appointment.
 *
 * @param data - The updated appointment fields.
 * @param id   - The UUID of the appointment to update.
 * @throws {AppError} If no appointment is found with the given `id`.
 * @throws {AppError} If the new time range collides with another appointment.
 * @returns A promise that resolves when the update is complete.
 */
    async updateAppointment(data: UpdateApointmentInput, id: string) {
        const appointment = await this.adminAppointmentsRepository.getById(id)

        if (!appointment) throw new AppError('Appointment not found')

        await appointmentsService.avoidCollision(data.startTime, data.endTime, appointment.id)

        await this.adminAppointmentsRepository.update(data, appointment.id)
    }

    /**
     * Permanently deletes an appointment after verifying it exists.
     *
     * @param id - The UUID of the appointment to delete.
     * @throws {AppError} If no appointment is found with the given `id`.
     * @returns A promise that resolves when the deletion is complete.
     */
    async deleteAppointment(id: string) {
        const appointment = await this.adminAppointmentsRepository.getById(id)

        if (!appointment) throw new AppError('Appointment not found')

        await this.adminAppointmentsRepository.delete(id)
    }

    /**
     * Creates a new appointment manually, resolving or creating the associated
     * customer record in the process.
     *
     * If `isRegisterClient` is `true`, the method looks up an existing customer
     * by phone number and throws if none is found. Otherwise, a new customer
     * record is created from the provided name and phone data.
     *
     * Collision detection is always performed before any write operation.
     *
     * @param data - The full input for manual appointment creation.
     * @throws {AppError} If `isRegisterClient` is `true` and no customer matches `clientPhone`.
     * @throws {AppError} If the requested time slot overlaps with an existing appointment.
     * @returns A promise that resolves when the appointment has been created.
     */
    async createManualAppointment(data: NewAppointmentManuallyInput) {

        const { appointmentDate, clientPhone, endTime, adittionalPrice, isRegisterClient, serviceId, startTime, extrasId } = data

        await appointmentsService.avoidCollision(startTime, endTime)

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



        const appointment = await this.adminAppointmentsRepository.createManually({
            appointmentDate,
            customerId: customer.id,
            endTime,
            serviceId,
            startTime,
            adittionalPrice: adittionalPrice.toString()
        })

        const cleanExtrasId = extrasId.filter(id => typeof id === 'string')
        await appointmentExtrasService.insertAppointmentExtras(appointment.id, cleanExtrasId)
    }

    /**
     * Cancels all appointments for a given calendar day, excluding those already
     * in a terminal state (`PAID` or `COMPLETED`).
     *
     * The day boundaries are computed in the configured application timezone.
     *
     * @param day - A `Date` object representing the target day.
     * @returns A promise that resolves when all eligible appointments have been cancelled.
     */
    async cancellAllDayAppointments(day: Date) {
        const startDay = new TZDate(day, TIMEZONE)
        startDay.setHours(0, 0, 0, 0)

        const endDay = new TZDate(day, TIMEZONE)
        endDay.setHours(23, 59, 59, 999)

        await this.adminAppointmentsRepository.cancellAllOfDay(startDay, endDay)
    }

    /**
     * Creates a blocked time slot after verifying no collision exists.
     * Block times prevent customers from booking the slot without attaching
     * a real service or customer.
     *
     * @param data - The time range and metadata for the block, conforming to `BlockTimeInput`.
     * @throws {AppError} If the requested time range overlaps with an existing appointment.
     * @returns A promise that resolves when the block time has been created.
     */
    async createBlockTime(data: BlockTimeInput) {
        await appointmentsService.avoidCollision(data.startTime, data.endTime)
        await this.adminAppointmentsRepository.createBlockTime(data)
    }

    async updateBlock(data: BlockTimeInput, id: string) {
        await this.adminAppointmentsRepository.updateBlock(data, id)
    }

    async getNoShowRate(startRange?: TZDate, endRange?: TZDate) {
        const startRangeString = startRange ? startRange.toISOString() : undefined
        const endRangeString = endRange ? endRange.toISOString() : undefined

        return await this.adminAppointmentsRepository.getNoShowRate(startRangeString, endRangeString)
    }
}

export const adminAppointmentsService = new AdminAppointmentsService(
    adminAppointmentsRepository,
    customersService
)