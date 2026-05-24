import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// Load .env.local first (Next.js convention), fall back to .env
dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"], // direct connection required for migrations
  },
});
