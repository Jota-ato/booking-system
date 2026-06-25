import { db } from "@/db"
import { NewService, Service, services } from "@/db/schema"
import { RawServiceWithExtras } from "../types/service.types"
import { ServiceInput } from "../schemas/service-schema"
import { eq } from "drizzle-orm"

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
    getById(id: string): Promise<Service | undefined>
    create(payload: NewService): Promise<Service>
    update(payload: NewService, id: string): Promise<Service>
    delete(id: string): Promise<void>
    reactive(id: string): Promise<void>
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

    async getById(id: string): Promise<Service | undefined> {
        return (
            await db
                .query
                .services
                .findFirst({
                    where: (service, {eq}) => eq(service.id, id)
                })
        ) ?? undefined
    }

    async create(payload: NewService): Promise<Service> {
        return (await db
            .insert(services)
            .values(payload)
            .returning())[0]
    }

    async update(payload: NewService, id: string): Promise<Service> {
        return (
            await db
                .update(services)
                .set({
                    name: payload.name,
                    price: payload.price.toString(),
                    description: payload.description,
                    image: payload.image
                })
                .where(eq(services.id, id))
                .returning()
        )[0]
    }

    async delete(id: string): Promise<void> {
        await db
            .update(services)
            .set({
                isActive: false
            })
            .where(eq(services.id, id))
    }

    async reactive(id: string): Promise<void> {
        await db
            .update(services)
            .set({
                isActive: true
            })
            .where(eq(services.id, id))
    }
}

export const serviceRepository = new ServiceRepository()