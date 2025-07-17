-- Add payment_method column to orders table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
        ALTER TABLE "orders" ADD COLUMN "payment_method" text;
    END IF;
END $$;

-- Create app_settings table (if not exists)
CREATE TABLE IF NOT EXISTS "app_settings" (
    "key" text PRIMARY KEY NOT NULL,
    "value" jsonb
);

-- Create user_sessions table for PostgreSQL session storage (if not exists)
CREATE TABLE IF NOT EXISTS "user_sessions" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

-- Add primary key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'user_sessions' AND constraint_name = 'user_sessions_pkey') THEN
        ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    END IF;
END $$;

-- Add index if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'user_sessions' AND indexname = 'IDX_user_sessions_expire') THEN
        CREATE INDEX "IDX_user_sessions_expire" ON "user_sessions" ("expire");
    END IF;
END $$; 