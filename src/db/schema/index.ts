// Single entry point for all schema objects, relations, and types.
// Usage: import { appointments, customers, services } from "@/db/schema"
//
// Import order matters here: table files first, relations last.
// Relations depend on all three table files — never the reverse.

export * from "./appointments";
export * from "./customers";
export * from "./services";
export * from "./relations";