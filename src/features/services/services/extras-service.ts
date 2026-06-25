import { NewExtra, NewServiceExtra, ServiceExtra } from "@/db/schema";
import { extrasRepository, IExtrasRepository } from "./extras-repository";
import { ExtraInput, ServiceInput } from "../schemas/service-schema";
import { AppError } from "@/shared/lib/errors";

class ExtrasService {
    constructor(
        private extraRepository: IExtrasRepository
    ) { }

    async getExtras() {
        return await this.extraRepository.getAll()
    }

    async getExtraById(id: string) {
        return await this.extraRepository.getExtraById(id)
    }

    async createExtra(input: ExtraInput) {
        const payload: NewExtra = {
            name: input.name,
            description: input.description,
            price: input.price.toString(),
            isActive: true
        }

        return await this.extraRepository.createExtra(payload)
    }

    async editExtra(input: ExtraInput, id: string, isActive: boolean) {

        const dbExtra = await this.getExtraById(id)

        if (!dbExtra) {
            throw new AppError("Extra not found")
        }

        const payLoad = {
            ...input,
            price: input.price.toString(),
            id,
            isActive
        }

        return await this.extraRepository.editExtra(payLoad, id)
    }

    async getServiceExtras(serviceId: string) {
        return await this.extraRepository.getServiceExtras(serviceId)
    }

    async createServiceExtras(extrasIds: (string | null | undefined)[], serviceId: string, included: boolean = false) {

        const filteredExtrasIds = extrasIds.filter(id => id !== null && id !== undefined);

        const payload: NewServiceExtra[] = filteredExtrasIds.map(extraId => ({
            serviceId,
            extraId,
            included
        }))

        await this.extraRepository.createServiceExtras(payload)
    }

    async deleteServiceExtras(serviceId: string) {
        await this.extraRepository.deleteServiceExtras(serviceId)
    }
}

export const extrasService = new ExtrasService(extrasRepository)