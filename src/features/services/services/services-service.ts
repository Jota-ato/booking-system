import { ServiceWithExtras } from "../types/service.types";
import { IServiceRepository, serviceRepository } from "./services-repository";

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
                extras: service.serviceExtras.map(pivot => pivot.extra)
            };
        });
    }
}

export const servicesService = new ServicesService(
    serviceRepository
)