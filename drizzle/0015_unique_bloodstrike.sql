ALTER TABLE "extras" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "description" SET NOT NULL;