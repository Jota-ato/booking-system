import { z } from "zod";

export const customerSchema = z.object({
    clientName: z.string().min(2, { message: 'Client name is necessary' }),
    clientLastName: z.string().min(2, { message: 'Client last name is necessary' }),
});