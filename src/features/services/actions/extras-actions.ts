"use server"

import { adminAction } from "@/shared/lib/actions"
import { ExtraInput, extraSchema } from "../schemas/service-schema"
import { extrasService } from "../services/extras-service"
import { AppError } from "@/shared/lib/errors"

export const createExtraAction = adminAction(async (input: ExtraInput) => {
    const zodResponse = extraSchema.safeParse(input)

    if (!zodResponse.success) {
        throw new AppError(zodResponse.error.message)
    }

    const extra = await extrasService.createExtra(input)

    return `${extra.name} created successfully`
})