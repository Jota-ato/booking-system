import { db } from "@/db"
import { NewService, Service, services } from "@/db/schema"
import { RawServiceWithExtras } from "../types/service.types"
import { ServiceInput } from "../schemas/service-schema"

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
    getAll(): Promise<RawServiceWithExtras[]>
    create(payload: NewService): Promise<Service>
}

/**
 * Drizzle ORM–based implementation of {@link IServiceRepository}.
 *
 * All database interactions are performed through the shared `db` instance.
 */
class ServiceRepository implements IServiceRepository {
    /** @inheritdoc */
    async getAll(): Promise<RawServiceWithExtras[]> {
        return await db
            .query
            .services
            .findMany({
                with: {
                    serviceExtras: {
                        with: {
                            extra: true
                        }
                    }
                }
            })
    }

    async create(payload: NewService): Promise<Service> {
        return (await db
            .insert(services)
            .values(payload)
            .returning())[0]
    }
}

export const serviceRepository = new ServiceRepository()