import { defineConfig } from "prisma/config";

process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
  url: process.env.DIRECT_URL!,
  },
});