// drizzle.config.ts
import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config(); // loads .env

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    ssl: false,
  },
} satisfies Config;
