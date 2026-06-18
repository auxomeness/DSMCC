import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, env } from "prisma/config";

const projectRoot = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(projectRoot, "backend/.env") });

export default defineConfig({
  schema: "backend/prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx backend/prisma/seed.ts"
  },
  datasource: { url: env("DATABASE_URL") },
});
