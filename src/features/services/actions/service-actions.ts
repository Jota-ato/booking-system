"use server"

import { adminAction } from "@/shared/lib/actions"
import { ServiceInput, serviceSchema } from "../schemas/service-schema"
import { AppError } from "@/shared/lib/errors";
import { servicesService } from "../services/services-service";

export const createServiceAction = adminAction(async (input: ServiceInput) => {
    const zodResponse = serviceSchema.safeParse(input);

    if (!zodResponse.success) {
        throw new AppError("Something went wrong");
    }

    const service = await servicesService.createService(input);

    return `Service ${service.name} created successfully`
})

export const updateServiceAction = adminAction(async (input: ServiceInput, id: string) => {
    const zodResponse = serviceSchema.safeParse(input);

    if (!zodResponse.success) {
        throw new AppError("Something went wrong");
    }

    const service = await servicesService.updateService(input, id);

    return "Service updated successfully"
})