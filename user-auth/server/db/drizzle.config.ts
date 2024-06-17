import type { Config } from "drizzle-kit";
import { env } from "../config/env";

export default {
	schema: "./db/schema.ts",
	out: "./drizzle/migrations",
	dialect: "sqlite",
	driver: "turso",
	dbCredentials: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	},
} satisfies Config;
