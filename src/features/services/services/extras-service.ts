import { NewExtra, NewServiceExtra, ServiceExtra } from "@/db/schema";
import { extrasRepository, IExtrasRepository } from "./extras-repository";
import { ExtraInput, ServiceInput } from "../schemas/service-schema";

class ExtrasService {
    constructor(
        private extraRepository: IExtrasRepository
    ) { }

    async getExtras() {
        return await this.extraRepository.getAll()
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