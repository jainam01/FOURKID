CREATE TABLE "app_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"sid" text PRIMARY KEY NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending payment';--> statement-breakpoint
ALTER TABLE "banners" ADD COLUMN "desktop_image" text NOT NULL;--> statement-breakpoint
ALTER TABLE "banners" ADD COLUMN "mobile_image" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_reset_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_reset_token_expires" timestamp;--> statement-breakpoint
ALTER TABLE "banners" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_password_reset_token_unique" UNIQUE("password_reset_token");