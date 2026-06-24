import { Service } from "@/db/schema";
import { ServiceInput } from "../schemas/service-schema";
import { ServiceWithExtras } from "../types/service.types";
import { extrasService } from "./extras-service";
import { IServiceRepository, serviceRepository } from "./services-repository";
import { AppError } from "@/shared/lib/errors";

/**
 * Application-layer service responsible for retrieving the service catalog.
 *
 * Delegates all persistence operations to the injected {@link IServiceRepository},
 * serving as the single entry point for service-related queries in the application.
 *
 * @example
 * const services = await servicesService.getServices();
 */
class ServicesService {
    /**
     * @param serviceRepository - Data access layer for service catalog records.
     */
    constructor(
        private serviceRepository: IServiceRepository
    ) { }

    /**
     * Retrieves all available services from the catalog.
     *
     * @returns A promise that resolves to an array of `Service` records.
     *          Returns an empty array if no services exist.
     */
    async getServices(): Promise<ServiceWithExtras[]> {
        const rawServices = await this.serviceRepository.getAll();

        const activeServices = rawServices.filter(
            service => service.isActive && service.name !== "Manual Block"
        );

        return activeServices.map(service => {
            return {
                data: service,
                extras: service.serviceExtras.map(pivot => pivot)
            };
        });
    }

    async getServiceById(id: string): Promise<Service | undefined> {
        return await this.serviceRepository.getById(id);
    }

    async createService(input: ServiceInput): Promise<Service> {
        const payload = {
            name: input.name,
            price: input.price.toString(),
            description: input.description,
            image: input.image
        }

        const service = await this.serviceRepository.create(payload);
        await this.createExtras(input, service.id);
        return service
    }

    async updateService(input: ServiceInput, id: string): Promise<Service> {
        const dbService = await this.getServiceById(id);

        if (!dbService) {
            throw new AppError("Service not found");
        }

        const payload = {
            name: input.name,
            price: input.price.toString(),
            description: input.description,
            image: input.image
        }

        const newService = await this.serviceRepository.update(payload, dbService.id);
        await this.deleteExtras(newService.id);
        await this.createExtras(input, newService.id);
        return newService
    }

    async deteleService(id: string): Promise<void> {
        await this.deleteExtras(id);
        await this.serviceRepository.delete(id);
    }

    async createExtras({ includedExtras, availableExtras }: ServiceInput, serviceId: string): Promise<void> {
        await extrasService.createServiceExtras(includedExtras, serviceId, true);
        await extrasService.createServiceExtras(availableExtras, serviceId, false);
    }

    async deleteExtras(serviceId: string): Promise<void> {
        await extrasService.deleteServiceExtras(serviceId);
    }
}

export const servicesService = new ServicesService(
    serviceRepository
)