import { z } from "zod";

export const serviceSchema = z.object({
    name: z.string({ error: 'service name is required' }).min(3, {error: 'name too short'}),
    description: z.string({ error: 'service description is required' }).min(3, {error: 'description too short'}),
    price: z.number({ error: 'service price is required' }).min(0),
    includedExtras: z.array(z.uuid().nullable().optional()),
    availableExtras: z.array(z.uuid().nullable().optional()),
    image: z.url({ error: 'image is required' })
})

export type ServiceInput = z.infer<typeof serviceSchema>