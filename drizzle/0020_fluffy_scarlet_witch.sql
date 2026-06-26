CREATE TABLE "appoinment_extras" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appointment_id" uuid NOT NULL,
	"extra_id" uuid NOT NULL,
	"extra_price_snapshot" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appoinment_extras" ADD CONSTRAINT "appoinment_extras_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appoinment_extras" ADD CONSTRAINT "appoinment_extras_extra_id_extras_id_fk" FOREIGN KEY ("extra_id") REFERENCES "public"."extras"("id") ON DELETE restrict ON UPDATE no action;