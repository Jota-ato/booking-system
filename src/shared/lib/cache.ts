import { servicesService } from "@/features/services/services/services-service";
import { ServiceWithExtras } from "@/features/services/types/service.types";
import { unstable_cache } from "next/cache";


/**
 * Obtiene los servicios activos e incluye su lógica de caché persistente.
 * * - 'public-services': Es la clave única en la Data Cache.
 * - tags: Permite la invalidación selectiva (On-Demand Revalidation).
 */
export const getSharedPublicServices = unstable_cache(
    async (): Promise<ServiceWithExtras[]> => {
        return await servicesService.getActiveServices();
    },
    ["public-services"], // Clave de caché
    {
        tags: ["services-tag"], // Etiqueta para invalidar después
    }
);