import "./lib/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.POSTGRES_URL) {
  throw new Error("DB_URL environment variable is required.");
}

export default defineConfig({
  schema: "./lib/drizzle/schema.ts",
  out: "./lib/drizzle/migrations",
  dialect: "postgresql",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
  migrations: {
    table: "migrations",
    schema: "public",
  },
});
