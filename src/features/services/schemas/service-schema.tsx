import { z } from "zod";

export const baseServiceSchema = z.object({
    name: z.string({ error: 'service name is required' }).min(3),
    description: z.string({ error: 'service description is required' }).min(3),
    price: z.number({ error: 'service price is required' }).min(0),
})

