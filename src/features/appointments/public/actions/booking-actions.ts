"use server"

import { customersService } from "@/features/customers/services/customers-service"
import { customerAction } from "@/shared/lib/actions"
import { AppError } from "@/shared/lib/errors"
import { UserInput, userSchema } from "../schemas/booking-schema"

export const getUserAction = customerAction(async (phone: string) => {
    const customer = await customersService.getClientByPhone(phone)

    if (!customer) throw new AppError(`Customer with phone ${phone} not found`)

    return {
        message: `Customer found: ${customer.name} ${customer.lastName}`,
        data: customer
    }
})

export const registerUserAction = customerAction(async (user: UserInput) => {
    const zodResponse = userSchema.safeParse(user)

    if (!zodResponse.success) throw new AppError("Invalid user data")
    if (!("name" in zodResponse.data) || !zodResponse.data.name) throw new AppError("Name is required")

    const phone = `+${zodResponse.data.countryCode}${zodResponse.data.phone}`
    const customer = await customersService.createClient({
        name: zodResponse.data.name,
        lastName: zodResponse.data.lastName,
        phone: phone
    })
    return {
        message: `Customer registered: ${customer.name} ${customer.lastName}`,
        data: customer
    }
})