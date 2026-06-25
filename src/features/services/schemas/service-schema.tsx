import { z } from "zod";

export const serviceSchema = z.object({
    name: z.string({ error: 'service name is required' }).min(3, {error: 'name too short'}),
    description: z.string({ error: 'service description is required' }).min(3, {error: 'description too short'}),
    price: z.number({ error: 'service price is required' }).min(0),
    includedExtras: z.array(z.uuid().nullable().optional()),
    availableExtras: z.array(z.uuid().nullable().optional()),
    image: z.url({ error: 'image is required' })
})

export const extraSchema = z.object({
    name: z.string({ error: 'extra name is required' }).min(3, {error: 'name too short'}),
    description: z.string({ error: 'extra description is required' }).min(3, {error: 'description too short'}).nullable(),
    price: z.number({ error: 'extra price is required' }).min(0),
})

export type ServiceInput = z.infer<typeof serviceSchema>
export type ExtraInput = z.infer<typeof extraSchema>