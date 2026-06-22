import {
    numeric,
    pgTable,
    text,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { services } from "./services";

export const extras = pgTable("extras",
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: varchar("name", { length: 60 }).notNull(),
        description: text('description'),
        price: numeric("price", { precision: 10, scale: 2 })
    }
);

// Pivot table
export const serviceExtras = pgTable("service_extras",
    {
        id: uuid('id').primaryKey().defaultRandom(),
        serviceId: uuid("service_id")
            .notNull()
            .references(() => services.id, { onDelete: "restrict" }),
        extraId: uuid("extra_id")
            .notNull()
            .references(() => extras.id, { onDelete: "cascade" }),
    }
);

export type Extra = typeof extras.$inferSelect;
export type NewExtra = typeof extras.$inferInsert;
export type ServiceExtra = typeof serviceExtras.$inferSelect;
export type NewServiceExtra = typeof serviceExtras.$inferInsert;