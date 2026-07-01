import { Customer } from "@/db/schema";

export function isCustomer(value: unknown): value is Customer {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const candidate = value as Record<string, unknown>;

    return (
        typeof candidate.id === "string" &&
        typeof candidate.phone === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.lastName === "string"
    );
}