import { TIMEZONE } from "@/shared/lib/date";
import { appointmentsRepository, IAppointmentsRepository } from "./appointments-repository";
import { TZDate } from "@date-fns/tz";
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
    appointmentsRepository
)