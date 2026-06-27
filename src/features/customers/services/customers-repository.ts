import { db } from "@/db"
import { Customer, customers, NewCustomer } from "@/db/schema"
import { CustomerWithAppointmentCount, FullCustomer } from "../types/customer.types"
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
    getByPhone(phone: string, full?: boolean): Promise<Customer | FullCustomer | undefined>
    getById(id: string, full?: boolean): Promise<Customer | FullCustomer | undefined>

    /**
     * Inserts a new customer record and returns the persisted entity.
     *
     * @param data - The customer data to insert, conforming to `NewCustomer`.
     * @returns A promise that resolves to the newly created `Customer` record,
     *          including any database-generated fields such as `id`.
     */
    createClient(data: NewCustomer): Promise<Customer>
    getAll(page: number, limit: number): Promise<{ data: CustomerWithAppointmentCount[], totalPages: number }>
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
    async getByPhone(phone: string, full: boolean = false): Promise<Customer | FullCustomer | undefined> {
        return await db
            .query
            .customers
            .findFirst({
                where: (customer, { eq }) => eq(customer.phone, phone),
                with: {
                    appointments: full ? {
                        with: {
                            service: true,
                            appoinmentExtras: true
                        }
                    } : undefined
                }
            })
    }

    async getById(id: string, full: boolean = false): Promise<Customer | FullCustomer | undefined> {
        return await db
            .query
            .customers
            .findFirst({
                where: (customer, { eq }) => eq(customer.id, id),
                with: {
                    appointments: full ? {
                        with: {
                            service: true,
                            appoinmentExtras: true
                        }
                    } : undefined
                }
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

    async getAll(page: number, limit: number): Promise<{ data: CustomerWithAppointmentCount[], totalPages: number }> {

        const offset = (page - 1) * limit

        const [data, total] = await Promise.all([
            db
                .query
                .customers
                .findMany({
                    limit,
                    offset,
                    extras: {
                        appointmentCount: sql<number>`
                    (SELECT COUNT(*) FROM "appointments" WHERE "appointments"."customer_id" = "customers"."id")
                `.as("appointment_count")
                    },
                    where: (customer, { not, eq }) => not(eq(customer.id, "caefa19f-5766-4244-8213-b9c969da4e68"))
                }),
            db
                .$count(customers)
        ])

        return {
            data,
            totalPages: Math.ceil(total / limit)
        }
    }

    async getCount(): Promise<number> {
        return await db
            .$count(customers) - 1
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