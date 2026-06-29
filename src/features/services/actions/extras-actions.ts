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
},
    "extras-tag"
)

export const editExtraAction = adminAction(async (input: ExtraInput, id: string, isActive: boolean) => {
    const zodResponse = extraSchema.safeParse(input)

    if (!zodResponse.success) {
        throw new AppError(zodResponse.error.message)
    }

    const extra = await extrasService.editExtra(input, id, isActive)

    return `${extra.name} updated successfully`
},
    "extras-tag"
)

export const deleteExtraAction = adminAction(async (id: string) => {
    await extrasService.deleteExtra(id)
    return "Extra deleted successfully"
},
    "extras-tag"
)

export const reactivateExtraAction = adminAction(async (id: string) => {
    const extra = await extrasService.reactivateExtra(id)
    return `${extra.name} reactivated successfully`
}, "extras-tag")