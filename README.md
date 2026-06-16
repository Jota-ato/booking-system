# Apex Booking Engine (v2.0)

A high-performance, enterprise-ready, single-location scheduling SaaS framework. Built upon React 19, Next.js 15 (App Router), Drizzle ORM, Neon Serverless PostgreSQL, and TypeScript, this architecture provides a completely decoupled, modular, and type-safe engine designed for commercial licensing.

---

## 🏗️ System Architecture & Directory Layout

To eliminate modular inflation and isolate administrative controls from the client-facing booking interface, the system splits scheduling capabilities into specialized actor domains:

```
src/features/appointments/
├── shared/                         # ── SHARED DOMAIN SCHEMA & CONTRACTS ──
│   ├── schemas/
│   │   └── appointment-schema.ts   # Polymorphic string/ISO validation contracts
│   └── types/
│       └── appointments.types.ts   # Shared static type interfaces
│
├── core/                           # ── PERSISTENCE & DATA MANAGEMENT ──
│   ├── repositories/
│   │   └── appointments-repository.ts # Raw Drizzle DB queries, decoupled from business rules
│   └── services/
│       ├── query-service.ts        # Highly-optimized, read-only analytics & availability queries
│       ├── public-service.ts       # Secure client-facing booking entries (unauthenticated write)
│       └── admin-service.ts        # Privileged admin-only operations (history, updates, deletion)
│
├── admin-dashboard/                 # ── SUB-FEATURE: PRIVATE MANAGEMENT LAYER ──
│   ├── actions/                    # Single-Responsibility Server Actions (admin-protected)
│   │   ├── create-time-block.ts
│   │   ├── cancel-all-day.ts
│   │   ├── delete-appointment.ts
│   │   └── update-appointment.ts
│   ├── components/                 # Administrative-only interface row and form elements
│   │   ├── block-period-form.tsx
│   │   ├── block-time-form.tsx
│   │   ├── appointment-row.tsx
│   │   └── appointment-row-details.tsx
│   └── stores/
│       └── appointment-store.ts    # React client-state container
│
└── public-booking/                 # ── SUB-FEATURE: PUBLIC SALES FUNNEL ──
    ├── actions/
    │   └── book-appointment.ts     # Public-access reservation entrypoint
    ├── components/
    │   ├── time-slot-picker.tsx
    │   └── booking-stepper.tsx     # Step-by-step reservation UI
    └── utils/
        ├── slots-engine.ts         # Math engine calculating open spots from busy arrays
        └── whatsapp-helper.ts      # Structured WhatsApp redirect URL generator
```

---

## 🛠️ Core Source Code Implementations

Below are the complete, type-safe, and decoupled source files comprising the central engine.

### 1. Unified Schema & Polymorphic Validator (`shared/schemas/appointment-schema.ts`)

This schema enforces temporal rules. The `validateTimeRange` routine supports both `"HH:MM"` client-input structures and standard ISO-8601 server strings securely.

```typescript
import { z } from "zod";

/**
 * Validates logical ranges, parsing both "HH:MM" client strings and raw ISO strings safely.
 */
const validateTimeRange = (data: { startTime: string; endTime: string; appointmentDate: Date }) => {
    const startTime = new Date(data.appointmentDate);
    const endTime = new Date(data.appointmentDate);

    if (data.startTime.includes('T') && data.endTime.includes('T')) {
        const parsedStart = new Date(data.startTime);
        const parsedEnd = new Date(data.endTime);
        return parsedEnd.getTime() > parsedStart.getTime();
    }

    const [startHour, startMinutes] = data.startTime.split(':');
    const [endHour, endMinutes] = data.endTime.split(':');

    startTime.setHours(Number(startHour), Number(startMinutes), 0, 0);
    endTime.setHours(Number(endHour), Number(endMinutes), 0, 0);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return false;
    }

    return endTime > startTime;
};

const timeRangeError = {
    message: "End schedule must occur after the start schedule.",
    path: ["endTime"],
};

export const baseAppointmentSchema = z.object({
    serviceId: z.string().uuid({ message: "Invalid service identifier" }),
    appointmentDate: z.date({ required_error: "A valid date is required" }),
    startTime: z.string(),
    endTime: z.string(),
    extrasPrice: z.number().default(0)
});

export const updateAppointmentSchema = baseAppointmentSchema.extend({
    status: z.enum(["pending", "approved", "paid", "cancelled"]),
}).refine(validateTimeRange, timeRangeError);

export const blockTimeSchema = baseAppointmentSchema.pick({
    appointmentDate: true,
    startTime: true,
    endTime: true
}).refine(validateTimeRange, timeRangeError);

export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type BlockTimeInput = z.infer<typeof blockTimeSchema>;
```

---

### 2. High-Order Administrative Pipeline Wrapper (`shared/lib/actions.ts`)

Encapsulates authentication, database transaction safety, and domain-error filtering into a reusable compiler-friendly utility. Uses dynamic imports to keep Server Components and client-side bundlers uncoupled.

```typescript
// Strict Server-Only Wrapper (No Top-Level Await)
import { AppError } from "@/shared/lib/errors";

export interface ActionResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

/**
 * High-Order Function that wraps administrative actions, enforcing session verification,
 * dynamic imports, and generalized application error mapping.
 */
export function adminAction<T extends any[], R>(
    callback: (...args: T) => Promise<R>
): (...args: T) => Promise<ActionResponse<R>> {
    return async (...args: T) => {
        try {
            // Lazy load server headers/auth dynamically during execution
            const { requireAuth } = await import("@/lib/auth-server");
            
            const { isAdmin } = await requireAuth();
            if (!isAdmin) {
                return {
                    success: false,
                    message: "Access Denied: Administrative privileges required."
                };
            }

            const result = await callback(...args);

            return {
                success: true,
                message: typeof result === 'string' ? result : "Operation executed successfully.",
                data: typeof result !== 'string' ? result : undefined
            };

        } catch (error) {
            if (error instanceof AppError) {
                return {
                    success: false,
                    message: error.message
                };
            }

            console.error('[CORE_PIPELINE_UNHANDLED_ERROR]:', error);
            return {
                success: false,
                message: "A critical database or system exception occurred."
            };
        }
    };
}
```

---

### 3. Collision Engine & Core Query Service (`core/services/query-service.ts`)

Prevents double-bookings and conflicts with administrative blocks using overlapping intervals.

Two time intervals, defined as $[S_1, E_1]$ and $[S_2, E_2]$, overlap if and only if:

$$S_1 < E_2 \quad \text{and} \quad E_1 > S_2$$

This logic is mapped directly into an optimized SQL index search:

```typescript
import { IAppointmentsRepository, appointmentsRepository } from "../repositories/appointments-repository";
import { TZDate } from "@date-fns/tz";
import { TIMEZONE } from "@/shared/lib/date";

class AppointmentsQueryService {
    constructor(private readonly _repo: IAppointmentsRepository) {}

    async getDayAppointments(day: Date) {
        const startDay = new TZDate(day, TIMEZONE);
        startDay.setHours(0, 0, 0, 0);

        const endDay = new TZDate(day, TIMEZONE);
        endDay.setHours(23, 59, 59, 999);

        return await this._repo.getByDay(startDay, endDay);
    }

    /**
     * Checks if a specific interval overlaps with any active bookings or blocks.
     */
    async isSlotAvailable(startTime: string, endTime: string, excludeId?: string): Promise<boolean> {
        const conflicting = await this._repo.getByRange(startTime, endTime, excludeId);
        return conflicting.length === 0;
    }
}

export const appointmentsQueryService = new AppointmentsQueryService(appointmentsRepository);
```

---

### 4. Public Sales Funnel Service (`core/services/public-service.ts`)

Handles client-facing bookings. It only exposes slots that clear the validation check and prevents users from injecting malicious configuration parameters (e.g., unauthorized pricing modifications).

```typescript
import { IAppointmentsRepository, appointmentsRepository } from "../repositories/appointments-repository";
import { appointmentsQueryService } from "./query-service";
import { AppError } from "@/shared/lib/errors";

class AppointmentsPublicService {
    constructor(private readonly _repo: IAppointmentsRepository) {}

    async createPublicBooking(data: {
        appointmentDate: Date;
        startTime: string;
        endTime: string;
        customerId: string;
        serviceId: string;
    }) {
        const isAvailable = await appointmentsQueryService.isSlotAvailable(data.startTime, data.endTime);

        if (!isAvailable) {
            throw new AppError("The requested time slot has already been reserved. Please choose another.");
        }

        await this._repo.createManually({
            appointmentDate: data.appointmentDate,
            customerId: data.customerId,
            serviceId: data.serviceId,
            startTime: data.startTime,
            endTime: data.endTime,
            extrasPrice: "0.00" // Hard-enforced base value for non-admin entries
        });
    }
}

export const appointmentsPublicService = new AppointmentsPublicService(appointmentsRepository);
```

---

### 5. Administrative Controls Service (`core/services/admin-service.ts`)

Handles the administrative control panel's state, manages physical removals, triggers bulk status overrides, and configures scheduling blocks.

```typescript
import { IAppointmentsRepository, appointmentsRepository } from "../repositories/appointments-repository";
import { appointmentsQueryService } from "./query-service";
import { UpdateAppointmentInput } from "../../shared/schemas/appointment-schema";
import { AppError } from "@/shared/lib/errors";

class AppointmentsAdminService {
    constructor(private readonly _repo: IAppointmentsRepository) {}

    async updateAppointment(data: UpdateAppointmentInput, id: string) {
        const appointment = await this._repo.getById(id);
        if (!appointment) throw new AppError("The targeted appointment does not exist.");

        const isAvailable = await appointmentsQueryService.isSlotAvailable(data.startTime, data.endTime, id);
        if (!isAvailable) throw new AppError("Schedule conflict: Overlap with another active slot detected.");

        await this._repo.update(data, appointment.id);
    }

    async deleteAppointment(id: string) {
        const appointment = await this._repo.getById(id);
        if (!appointment) throw new AppError("The targeted appointment could not be located.");
        await this._repo.delete(id);
    }

    async applyTimeBlock(data: { startTime: string; endTime: string; appointmentDate: Date }) {
        const isAvailable = await appointmentsQueryService.isSlotAvailable(data.startTime, data.endTime);
        if (!isAvailable) throw new AppError("Unable to apply schedule block: The selected range contains existing bookings.");

        await this._repo.createManually({
            appointmentDate: data.appointmentDate,
            startTime: data.startTime,
            endTime: data.endTime,
            serviceId: "388308b9-56aa-4bf9-b86b-b6be42222660", // Hardcoded administrative "BLOCK_ID"
            customerId: "4da3ada8-9960-45d9-86fa-1498bfcb3584", // Hardcoded "BLOCK_CUSTOMER_ID"
            extrasPrice: "0.00"
        });
    }
}

export const appointmentsAdminService = new AppointmentsAdminService(appointmentsRepository);
```

---

### 6. Repository Access Layer (`core/repositories/appointments-repository.ts`)

An atomic data wrapper using Drizzle ORM to isolate database execution blocks from state logic.

```typescript
import { db } from "@/db";
import { Appointment, appointments, NewAppointment } from "@/db/schema";
import { UpdateAppointmentInput } from "../../shared/schemas/appointment-schema";
import { FullAppointment } from "../../shared/types/appointments.types";
import { TZDate } from "@date-fns/tz";
import { and, eq, gte, lte, lt, gt, neq } from "drizzle-orm";

export interface IAppointmentsRepository {
    getByDay(startDay: TZDate, endDay: TZDate): Promise<FullAppointment[]>;
    getById(id: string): Promise<Appointment | undefined>;
    getByRange(startRange: string, endRange: string, excludeId?: string): Promise<Appointment[]>;
    update(data: UpdateAppointmentInput, id: string): Promise<void>;
    delete(id: string): Promise<void>;
    createManually(data: NewAppointment): Promise<void>;
}

class AppointmentsRepository implements IAppointmentsRepository {
    async getByDay(startDay: TZDate, endDay: TZDate): Promise<FullAppointment[]> {
        return await db
            .query
            .appointments
            .findMany({
                where: (appointment, { gte, lte, and }) => and(
                    gte(appointment.startTime, startDay.toISOString()),
                    lte(appointment.startTime, endDay.toISOString())
                ),
                with: {
                    service: true,
                    customer: true
                },
                orderBy: (apt, { asc }) => asc(apt.startTime)
            });
    }

    async getById(id: string): Promise<Appointment | undefined> {
        return await db
            .query
            .appointments
            .findFirst({
                where: (appointment, { eq }) => eq(appointment.id, id)
            });
    }

    async getByRange(startRange: string, endRange: string, excludeId?: string): Promise<Appointment[]> {
        return await db
            .query
            .appointments
            .findMany({
                where: (appointment, { and, lt, gt, neq }) => {
                    const conditions = [
                        lt(appointment.startTime, endRange),
                        gt(appointment.endTime, startRange)
                    ];

                    if (excludeId) {
                        conditions.push(neq(appointment.id, excludeId));
                    }

                    return and(...conditions);
                }
            });
    }

    async update(data: UpdateAppointmentInput, id: string): Promise<void> {
        await db
            .update(appointments)
            .set({
                ...data,
                extrasPrice: data.extrasPrice.toString(),
                startTime: data.startTime,
                endTime: data.endTime
            })
            .where(eq(appointments.id, id));
    }

    async delete(id: string): Promise<void> {
        await db
            .delete(appointments)
            .where(eq(appointments.id, id));
    }

    async createManually(data: NewAppointment): Promise<void> {
        await db
            .insert(appointments)
            .values(data);
    }
}

export const appointmentsRepository = new AppointmentsRepository();
```

---

### 7. Global Response Interceptor Client (`shared/lib/client-actions.ts`)

Encapsulates user alerts on the client boundary. Marked explicitly with `"use client"` to prevent server compilation errors when executing `sonner` and DOM interactions.

```typescript
"use client"

import { toast } from "sonner";
import { ActionResponse } from "./actions"; // Imports TS structures safely

/**
 * Evaluates a Server Action outcome and triggers a standardized UI Toast alert.
 */
export const showResponse = (response: ActionResponse): boolean => {
    if (response.success) {
        toast.success(response.message);
    } else {
        toast.error(response.message);
    }
    return response.success;
};
```

---

## 💻 Local Setup & Execution Guide

### Prerequisites

- Node.js v18+ / v20+
- `pnpm` (mandatory package manager — `npm` or `yarn` will fail internal workspaces)
- A Postgres connection string

### Setup Sequence

**1. Clone & Install Dependencies**

```bash
git clone <repository-url>
cd booking-system
pnpm install
```

**2. Configure Environmental Variables**

Create a `.env.local` file in the root folder:

```env
# Relational Engine Location
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# UploadThing Asset Credentials
UPLOADTHING_TOKEN=your_secret_uploadthing_api_token
```

**3. Synchronize Relational Schemas**

Execute migration commands using Drizzle Kit:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

**4. Initialize Dev Environment**

```bash
pnpm dev
```

The local instance is now running on [http://localhost:3000](http://localhost:3000).
