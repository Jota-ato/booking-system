import { servicesService } from "@/features/services/services/services-service";
import { unstable_cache } from "next/cache";

/**
 * Tipo inferido o explícito del retorno de tus servicios.
 * Reemplaza esto con el tipo real de tu esquema de Drizzle/Supabase.
 */
export type ActiveServiceWithExtras = Awaited<
    ReturnType<typeof servicesService.getActiveServices>
>;

/**
 * Obtiene los servicios activos e incluye su lógica de caché persistente.
 * * - 'public-services': Es la clave única en la Data Cache.
 * - tags: Permite la invalidación selectiva (On-Demand Revalidation).
 */
export const getSharedPublicServices = unstable_cache(
    async (): Promise<ActiveServiceWithExtras> => {
        return await servicesService.getActiveServices();
    },
    ["public-services"], // Clave de caché
    {
        tags: ["services-tag"], // Etiqueta para invalidar después
    }
);