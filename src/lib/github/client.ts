import { Octokit } from "@octokit/rest";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/**
 * Authenticated Octokit for the signed-in user, or null when no GitHub account
 * is linked or its token is unusable.
 *
 * Better Auth 1.7 selects an account by its row id, not by provider, so the
 * linked account is looked up first. Server code only, and only behind a
 * session check - the account lookup throws for anonymous requests.
 */
export async function getGitHubClient(): Promise<Octokit | null> {
  const requestHeaders = await headers();

  const accounts = await auth.api.listUserAccounts({ headers: requestHeaders });
  const github = accounts.find((account) => account.providerId === "github");
  if (!github) return null;

  const { accessToken } = await auth.api.getAccessToken({
    body: { accountId: github.id },
    headers: requestHeaders,
  });
  if (!accessToken) return null;

  return new Octokit({ auth: accessToken });
}
