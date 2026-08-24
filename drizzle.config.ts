import { defineConfig } from "drizzle-kit";

// drizzle-kit loads .env itself (bundled dotenv). Fail fast on a missing
// value instead of handing the driver an empty URL.
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Add it to .env (see .env.example).");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dbCredentials: { url },
});
