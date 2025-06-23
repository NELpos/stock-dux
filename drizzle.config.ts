import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/core/db/*.ts",
  out: "./sql/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
