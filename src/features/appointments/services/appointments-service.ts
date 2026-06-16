import { TIMEZONE } from "@/shared/lib/date";
import { appointmentsRepository, IAppointmentsRepository } from "./appointments-repository";
import { TZDate } from "@date-fns/tz"
import { BlockTimeInput, NewAppointmentManuallyInput, UpdateApointmentInput } from "../schemas/appointment-schema";
import { Customer } from "@/db/schema";
import { customersRepository, ICustomersRepository } from "@/features/customers/services/customers-repository";
import { CustomersService, customersService } from "@/features/customers/services/customers-service";
import { AppError } from "@/shared/lib/errors";

/**
 * Application-layer service responsible for all appointment business logic.
 *
 * Orchestrates interactions between the appointments repository and the
 * customers service, enforcing rules such as collision detection and
 * customer resolution before any persistence operation is performed.
 *
 * @example
 * // Retrieve all appointments for today
 * const appointments = await appointmentsService.getDayAppointments(new Date());
 */
class AppointmentsService {
    /**
     * @param appointmentsRepository - Data access layer for appointment records.
     * @param customersService       - Service used to look up or create customer records.
     */
    constructor(
        private appointmentsRepository: IAppointmentsRepository,
        private customersService: CustomersService
    ) { }

    /**
     * Returns all appointments for a given calendar day, from midnight to 23:59:59,
     * adjusted to the configured application timezone.
     *
     * @param day - A `Date` object representing the target day.
     * @returns A promise that resolves to the list of full appointment records for that day.
     */
    async getDayAppointments(day: Date) {
        const startDay = new TZDate(day, TIMEZONE)
        startDay.setHours(0, 0, 0, 0)

        const endDay = new TZDate(day, TIMEZONE)
        endDay.setHours(23, 59, 59, 999)

        return await this.appointmentsRepository.getByDay(startDay, endDay)
    }

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
        const appointment = await this.appointmentsRepository.getById(id)

        if (!appointment) throw new AppError('Appointment not found')

        await this.avoidCollision(data.startTime, data.endTime, appointment.id)

        await this.appointmentsRepository.update(data, appointment.id)
    }

    /**
     * Permanently deletes an appointment after verifying it exists.
     *
     * @param id - The UUID of the appointment to delete.
     * @throws {AppError} If no appointment is found with the given `id`.
     * @returns A promise that resolves when the deletion is complete.
     */
    async deleteAppointment(id: string) {
        const appointment = await this.appointmentsRepository.getById(id)

        if (!appointment) throw new AppError('Appointment not found')

        await this.appointmentsRepository.delete(id)
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

        const { appointmentDate, clientPhone, endTime, extrasPrice, isRegisterClient, serviceId, startTime } = data

        await this.avoidCollision(startTime, endTime)

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

        await this.appointmentsRepository.cancellAllOfDay(startDay, endDay)
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
        await this.avoidCollision(data.startTime, data.endTime)
        await this.appointmentsRepository.createBlockTime(data)
    }

    /**
     * Checks whether any existing appointment overlaps with the given time range
     * and throws if a conflict is detected.
     *
     * This method is used internally before any create or update operation to
     * guarantee appointment slot integrity.
     *
     * @param startRange - ISO 8601 string for the start of the range to check.
     * @param endRange   - ISO 8601 string for the end of the range to check.
     * @param exludeId   - Optional UUID of an appointment to exclude from the check
     *                     (e.g., when updating an appointment that already occupies the slot).
     * @throws {AppError} If one or more overlapping appointments are found.
     * @returns A promise that resolves if no collision is detected.
     */
    async avoidCollision(startRange: string, endRange: string, exludeId?: string) {
        const appointments = await this.appointmentsRepository.getByRange(startRange, endRange, exludeId)

        if (appointments?.length) throw new AppError('There is already an appointment  in this range')
    }
}

export const appointmentsService = new AppointmentsService(
    appointmentsRepository,
    customersService
)