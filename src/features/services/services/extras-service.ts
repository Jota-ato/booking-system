import { NewServiceExtra, ServiceExtra } from "@/db/schema";
import { extrasRepository, IExtrasRepository } from "./extras-repository";
import { ServiceInput } from "../schemas/service-schema";

class ExtrasService {
    constructor(
        private extraRepository: IExtrasRepository
    ) { }

    async getExtras() {
        return await this.extraRepository.getAll()
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
}

export const extrasService = new ExtrasService(extrasRepository)