ALTER TABLE "appointments" ALTER COLUMN "customer_name_snapshot" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "service_name_snapshot" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "service_price_snapshot" DROP NOT NULL;