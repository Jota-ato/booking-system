import { IServiceRepository, serviceRepository } from "./services-repository";

class ServicesService {
    constructor (
        private serviceRepository: IServiceRepository
    ) {}

    async getServices() {
        return await this.serviceRepository.getAll()
    }
}

export const servicesService = new ServicesService(
    serviceRepository
)