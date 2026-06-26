import { NewCustomer } from "@/db/schema";
import { customersRepository, ICustomersRepository } from "./customers-repository";
import { AppError } from "@/shared/lib/errors";
import { TZDate } from "@date-fns/tz"

/**
 * Application-layer service responsible for customer business logic.
 *
 * Enforces uniqueness constraints and delegates all persistence operations
 * to the injected {@link ICustomersRepository}.
 *
 * @example
 * const customer = await customersService.getClientByPhone('525512345678');
 */
export class CustomersService {
    /**
     * @param customersRepository - Data access layer for customer records.
     */
    constructor(
        private customersRepository: ICustomersRepository
    ) { }

    /**
     * Retrieves a customer by their phone number.
     *
     * @param phone - The phone number to look up.
     * @returns A promise that resolves to the matching `Customer` record,
     *          or `undefined` if no customer is found.
     */
    async getClientByPhone(phone: string) {
        return await this.customersRepository.getByPhone(phone)
    }

    /**
     * Creates a new customer after verifying that no existing customer
     * is registered with the same phone number.
     *
     * @param data - The new customer data, conforming to `NewCustomer`.
     * @throws {Error} If a customer with the same phone number already exists.
     * @returns A promise that resolves to the newly created `Customer` record.
     */
    async createClient(data: NewCustomer) {
        const client = await this.getClientByPhone(data.phone)
        if (client) throw new AppError(`Client already exists, name: ${client.name} ${client.lastName}`)

        return await this.customersRepository.createClient(data)
    }

    async getCustomers(page: number, limit: number) {
        return await this.customersRepository.getAll(page, limit)
    }

    async getCustomerAmount() {
        return await this.customersRepository.getCount()
    }

    async getCustomersByTimeRange(startRange: TZDate, endRange: TZDate) {
        return await this.customersRepository.getCountByTimeRange(startRange, endRange)
    }
}

export const customersService = new CustomersService(
    customersRepository
)