import { extrasRepository, IExtrasRepository } from "./extras-repository";

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
}

export const extrasService = new ExtrasService(extrasRepository)