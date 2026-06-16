import { db } from "@/db"
import { Service } from "@/db/schema"

/**
 * Contract for all service catalog persistence operations.
 *
 * Implementations must support retrieving the full list of available services
 * from the data store.
 */
export interface IServiceRepository {
    /**
     * Retrieves all service records from the database.
     *
     * @returns A promise that resolves to an array of {@link Service} records.
     *          Returns an empty array if no services are found.
     */
    getAll(): Promise<Service[]>
}

/**
 * Drizzle ORM–based implementation of {@link IServiceRepository}.
 *
 * All database interactions are performed through the shared `db` instance.
 */
class ServiceRepository implements IServiceRepository {
    /** @inheritdoc */
    async getAll(): Promise<Service[]> {
        return await db
            .query
            .services
            .findMany()
    }
}

export const serviceRepository = new ServiceRepository()