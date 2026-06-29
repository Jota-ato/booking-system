import { z } from "zod"

export const contactSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.email({ message: "Invalid email address" }),
    message: z.string().min(1, { message: "Message is required" }),
})

export type ContactInput = z.infer<typeof contactSchema>