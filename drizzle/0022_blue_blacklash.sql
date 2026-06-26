ALTER TABLE "appoinment_extras" RENAME TO "appointment_extras";--> statement-breakpoint
ALTER TABLE "appointment_extras" DROP CONSTRAINT "appoinment_extras_appointment_id_appointments_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment_extras" DROP CONSTRAINT "appoinment_extras_extra_id_extras_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment_extras" ADD CONSTRAINT "appointment_extras_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_extras" ADD CONSTRAINT "appointment_extras_extra_id_extras_id_fk" FOREIGN KEY ("extra_id") REFERENCES "public"."extras"("id") ON DELETE restrict ON UPDATE no action;