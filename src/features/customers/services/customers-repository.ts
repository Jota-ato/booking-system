import { db } from "@/db"
import { Customer, customers, NewCustomer } from "@/db/schema"
import { CustomerWithAppointmentCount } from "../types/customer.types"
import { and, eq, gte, lte, sql } from "drizzle-orm"
import { TZDate } from "@date-fns/tz"

/**
 * Contract for all customer persistence operations.
 *
 * Implementations must support looking up customers by phone number
 * and inserting new customer records into the data store.
 */
export interface ICustomersRepository {
    /**
     * Retrieves a single customer by their phone number.
     *
     * @param phone - The phone number to search for.
     * @returns A promise that resolves to the matching customer record,
     *          or `undefined` if no customer is found.
     */
    getByPhone(phone: string): Promise<Customer | undefined>

    /**
     * Inserts a new customer record and returns the persisted entity.
     *
     * @param data - The customer data to insert, conforming to `NewCustomer`.
     * @returns A promise that resolves to the newly created `Customer` record,
     *          including any database-generated fields such as `id`.
     */
    createClient(data: NewCustomer): Promise<Customer>
    getAll(page: number, limit: number): Promise<CustomerWithAppointmentCount[]>
    getCount(): Promise<number>
    getCountByTimeRange(startRange: TZDate, endRange: TZDate): Promise<number>
}

/**
 * Drizzle ORM–based implementation of {@link ICustomersRepository}.
 *
 * All database interactions are performed through the shared `db` instance.
 */
class CustomersRepository implements ICustomersRepository {
    /** @inheritdoc */
    async getByPhone(phone: string): Promise<Customer | undefined> {
        return await db
            .query
            .customers
            .findFirst({
                where: (customer, { eq }) => eq(customer.phone, phone)
            })
    }

    /** @inheritdoc */
    async createClient(data: NewCustomer): Promise<Customer> {
        return (
            await db
                .insert(customers)
                .values(data)
                .returning()
        )[0]
    }

    async getAll(page: number, limit: number): Promise<CustomerWithAppointmentCount[]> {
        return await db
            .query
            .customers
            .findMany({
                limit,
                offset: (page - 1) * limit,
                extras: {
                    appointmentCount: sql<number>`
                    (SELECT COUNT(*) FROM "appointments" WHERE "appointments"."customer_id" = "customers"."id")
                `.as("appointment_count")
                },
                where: (customer, { not, eq }) => not(eq(customer.id, "caefa19f-5766-4244-8213-b9c969da4e68"))
            })
    }

    async getCount(): Promise<number> {
        return await db
            .$count(customers)
    }

    async getCountByTimeRange(startRange: TZDate, endRange: TZDate): Promise<number> {
        return await db
            .$count(customers, and(
                gte(customers.createdAt, startRange),
                lte(customers.createdAt, endRange)
            ))
    }
}

export const customersRepository = new CustomersRepository()