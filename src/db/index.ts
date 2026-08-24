import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";

import * as schema from "./schema";

// neon-http: one HTTP request per query - right for serverless reads, but it
// does NOT support interactive transactions (db.transaction() throws at
// runtime). Write paths must stay idempotent (dedup unique indexes + upserts,
// sync cursor updated last). If true atomicity is ever required, use the Neon
// websocket Pool for that path only.
const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
