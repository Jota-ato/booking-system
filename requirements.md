# Product Requirements Document (PRD) - Booking System Upgrade

## 1. General Information

### Project Name

**[White-Label Booking System / SaaS V2]**

### Version

**v2.0 (Refactor & Scalability Upgrade)**

### Date

**[June 12, 2026]**

### Team

- **Fullstack Developer & Architect:** [Julio César Zavala Blanco]
    
- **Stakeholder / Business Owner:** [Generic Client / Tenant]
    

## 2. The Problem (Why Refactor?)

The current MVP handles basic scheduling and WhatsApp redirection effectively, but it presents several bottlenecks for scaling and commercialization:

1. **Technical Debt:** The initial system was built during a learning phase. Migrating to **Drizzle ORM** and **Better Auth** will drastically improve performance, type safety, and security.
    
2. **Hardcoded Data:** Services and prices are currently hardcoded in the frontend. Any pricing update requires a developer's intervention, which is not scalable for a SaaS model.
    
3. **Complex Time Management:** The system needs a dynamic availability engine that calculates open slots based on the specific _duration_ of each service, preventing overlaps (e.g., a 2-hour appointment colliding with a 30-minute one).
    

## 3. Product Objective

Rebuild the core architecture to make the system **modular, secure, and self-manageable (white-label)**, ensuring that:

- The business owner (Admin) has full control over their services, pricing, and schedule availability via a private dashboard.
    
- The codebase becomes a "SaaS-ready" template that can be easily cloned, customized, and sold to various service-based businesses (clinics, salons, consultants, mechanics).
    

## 4. Key Use Cases

### UC-01: Dynamic Service Management

**Actor:** Admin (Business Owner) **Flow:**

1. Admin logs into the Dashboard.
    
2. Navigates to the "Services" module.
    
3. Adds a new service: "General Consultation", Price: $50.00, Duration: 45 minutes.
    
4. The system stores the service in the database.
    
5. The service instantly populates on the public booking page for customers to select.
    

### UC-02: Schedule Blocking (Time-Off Management)

**Actor:** Admin **Flow:**

1. Admin needs to take a day off or block a lunch break.
    
2. Accesses the Dashboard calendar and selects "Block Time Slot" (e.g., Nov 15th, 2:00 PM - 4:00 PM).
    
3. The booking engine immediately removes those specific slots from the public frontend, preventing any overlapping bookings.
    

## 5. Functional Requirements (FR)

### Authentication & Security

- **FR-01:** The system must use `better-auth` to protect the `/admin` routes.
    
- **FR-02:** Role-Based Access Control (RBAC): Only users with the `ADMIN` role can mutate appointments, business settings, or services.
    

### Admin Dashboard

- **FR-03:** The system must display a daily overview: Total appointments, estimated revenue, and pending confirmations.
    
- **FR-04:** The Admin must be able to perform CRUD (Create, Read, Update, Delete) operations on **Services** (Name, Price, Duration in minutes, Active Status).
    
- **FR-05:** The Admin must be able to update an appointment's status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
    
- **FR-06:** The Admin must be able to block full days or specific time ranges.
    

### Public Booking Engine

- **FR-07:** The frontend must fetch active services dynamically from the database.
    
- **FR-08 (Core Logic):** The system must calculate available time slots by evaluating already confirmed appointments and the _duration_ of the selected service to prevent collisions.
    
- **FR-09:** The booking form must strictly validate customer data (name, phone format, email) using `Zod`.
    
- **FR-10 (WhatsApp Bridge):** Upon successful booking, the system must save the record and dynamically generate a pre-filled WhatsApp link to redirect the customer for manual confirmation.
    

## 6. Non-Functional Requirements (Tech Stack V2)

- **Framework:** Next.js (App Router)
    
- **Database:** PostgreSQL (Neon or Supabase)
    
- **ORM:** Drizzle ORM
    
- **Authentication:** Better Auth
    
- **Validation:** Zod
    
- **UI & Styling:** Tailwind CSS + shadcn/ui
    

## 7. Proposed Database Schema (Drizzle)

The core architecture requires at least 3 main tables:

1. `users` (Managed by Better Auth for Admin access).
    
2. `services` (id, name, price, duration_minutes, is_active).
    
3. `appointments` (id, customer_name, customer_phone, service_id, appointment_date, start_time, end_time, status).
    

## 8. Future Roadmap (Version 3.0)

- **Payment Gateway:** Stripe integration to charge a 50% upfront deposit to reduce no-shows.
    
- **Automated Notifications:** Twilio/WhatsApp API integration to send automated reminders 24 hours before the appointment.
    
- **Headless CMS Integration:** Allow the business owner to publish blog posts or portfolio images without touching the code.