import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
dotenv.config({path:".env"})
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
});