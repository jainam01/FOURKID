-- Add payment_method column to orders table
ALTER TABLE "orders" ADD COLUMN "payment_method" text;

-- Create app_settings table
CREATE TABLE "app_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb
); 