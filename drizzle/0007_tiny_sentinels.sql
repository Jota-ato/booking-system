ALTER TABLE "appointments" ALTER COLUMN "extras_price" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "extras_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "full_price" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "full_price" SET NOT NULL;