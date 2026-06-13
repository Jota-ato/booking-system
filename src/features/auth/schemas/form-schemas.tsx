import { z } from "zod"

export const signInSchema = z.object({
    email: z.email({ error: "Please enter a valid email address." }),
    password: z.string().min(8, { error: "Password must be at least 8 characters long." }),
})

export type SignInInput = z.infer<typeof signInSchema>