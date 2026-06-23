import { db } from "@/db"
import { Extra, NewServiceExtra, ServiceExtra, serviceExtras } from "@/db/schema"

export interface IExtrasRepository {
    getAll(): Promise<Extra[]>
    getServiceExtras(serviceId: string): Promise<ServiceExtra[]>
    createServiceExtras(payload: NewServiceExtra[]): Promise<void>
}

class ExtrasRepository implements IExtrasRepository {
    async getAll(): Promise<Extra[]> {
        return await db
            .query
            .extras
            .findMany()
    }

    async getServiceExtras(serviceId: string): Promise<ServiceExtra[]> {
        return await db
            .query
            .serviceExtras
            .findMany({
                where: (serviceExtras, { eq }) => eq(serviceExtras.serviceId, serviceId)
            })
    }

    async createServiceExtras(payload: NewServiceExtra[]): Promise<void> {
        await db
            .insert(serviceExtras)
            .values(payload)
    }
}

export const extrasRepository = new ExtrasRepository()