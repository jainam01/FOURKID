import { defineConfig } from "drizzle-kit";
import "dotenv/config"; // Import dotenv to read .env file

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required for drizzle-kit");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  verbose: true,
  strict: true,
});
