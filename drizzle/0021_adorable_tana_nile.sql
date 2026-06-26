DROP INDEX "idx_appointments_date";--> statement-breakpoint
DROP INDEX "idx_appointments_date_status";--> statement-breakpoint
CREATE INDEX "idx_appointments_date_status" ON "appointments" USING btree ("status");--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "appointment_date";