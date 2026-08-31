import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/lib/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  // OAuth failures (state expired, provider error) land on our login page with ?error=... instead of Better Auth's built-in error page.
  onAPIError: { errorURL: "/login" },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
});

/** Current session for the incoming request, or null. Server code only (pages, route handlers). */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
