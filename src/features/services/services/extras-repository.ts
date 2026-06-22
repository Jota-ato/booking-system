import { db } from "@/db"
import { Extra, ServiceExtra } from "@/db/schema"

export interface IExtrasRepository {
    getAll(): Promise<Extra[]>
    getServiceExtras(serviceId: string): Promise<ServiceExtra[]>
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
}

export const extrasRepository = new ExtrasRepository()