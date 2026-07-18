// Prisma v7 configuration file
// Connection URLs are specified here (not in schema.prisma)
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Runtime database URL — use Supabase Transaction pooler (port 6543) in production
    url: process.env["DATABASE_URL"],
    // Used by Prisma Migrate — Supabase direct/session connection (port 5432)
    directUrl: process.env["DIRECT_URL"],
  },
});
