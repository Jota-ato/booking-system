import { db } from "@/db"
import { Service } from "@/db/schema"

export interface IServiceRepository {
    getAll(): Promise<Service[]>
}

class ServiceRepository implements IServiceRepository {
    async getAll(): Promise<Service[]> {
        return await db
            .query
            .services
            .findMany()
    }
}

export const serviceRepository = new ServiceRepository()