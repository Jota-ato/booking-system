import { db } from "@/db"
import { Extra, extras, NewExtra, NewServiceExtra, ServiceExtra, serviceExtras } from "@/db/schema"
import { eq } from "drizzle-orm"

export interface IExtrasRepository {
    getAll(): Promise<Extra[]>
    getExtraById(id: string): Promise<Extra | undefined>
    createExtra(payload: NewExtra): Promise<Extra>
    editExtra(payload: Extra, id: string): Promise<Extra>
    deleteExtra(id: string): Promise<void>
    reactivateExtra(id: string): Promise<Extra>
    getServiceExtras(serviceId: string): Promise<ServiceExtra[]>
    createServiceExtras(payload: NewServiceExtra[]): Promise<void>
    deleteServiceExtras(serviceId: string): Promise<void>
}

class ExtrasRepository implements IExtrasRepository {
    async getAll(): Promise<Extra[]> {
        return await db
            .query
            .extras
            .findMany()
    }

    async getExtraById(id: string): Promise<Extra | undefined> {
        return await db
            .query
            .extras
            .findFirst({
                where: (extras, { eq }) => eq(extras.id, id)
            })
    }

    async createExtra(payload: NewExtra): Promise<Extra> {
        return (
            await db
                .insert(extras)
                .values(payload)
                .returning()
        )[0]
    }

    async editExtra(payload: Extra, id: string): Promise<Extra> {
        return (
            await db
                .update(extras)
                .set(payload)
                .where(eq(extras.id, id))
                .returning()
        )[0]
    }

    async reactivateExtra(id: string): Promise<Extra> {
        return (
            await db
                .update(extras)
                .set({ isActive: true })
                .where(eq(extras.id, id))
                .returning()
        )[0]
    }

    async deleteExtra(id: string): Promise<void> {
        await db
            .update(extras)
            .set({ isActive: false })
            .where(eq(extras.id, id))
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

    async deleteServiceExtras(serviceId: string): Promise<void> {
        await db
            .delete(serviceExtras)
            .where(eq(serviceExtras.serviceId, serviceId))
    }
}

export const extrasRepository = new ExtrasRepository()