ALTER TABLE "appointment_extras" DROP CONSTRAINT "appointment_extras_appointment_id_appointments_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment_extras" ADD CONSTRAINT "appointment_extras_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;