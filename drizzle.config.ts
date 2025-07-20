import { defineConfig } from "drizzle-kit";
import "dotenv/config"; // Import dotenv to read .env file

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required for drizzle-kit");
}

if (!process.env.POSTGRES_URL_NON_POOLING) {
  throw new Error("POSTGRES_URL_NON_POOLING environment variable is required for drizzle-kit");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING,
  },

  verbose: true,
  strict: true,
});
