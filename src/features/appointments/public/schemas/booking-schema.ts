import { z } from "zod"

export const baseUserSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits"),
    name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
    lastName: z.string().min(1, "Last name is required").max(100, "Last name must be at most 100 characters"),
})

export const registerUserSchema = baseUserSchema.pick({
    phone: true
})

export const notRegisterUserSchema = baseUserSchema.pick({
    name: true,
    lastName: true,
    phone: true
})

export type RegisterUserSchema = z.infer<typeof registerUserSchema>
export type NotRegisterUserSchema = z.infer<typeof notRegisterUserSchema>
