import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/env.ts";

import * as schema from "./schema.ts";

const connection = postgres(env.DATABASE_URL);
const db = drizzle(connection, { schema, logger: true });

export default db;
