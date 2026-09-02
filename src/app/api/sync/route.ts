import {
  markSyncFailed,
  markSyncStarted,
  storeActivity,
} from "@/db/queries/activity";
import { getSession } from "@/lib/auth";
import { fetchRecentActivity } from "@/lib/github/activity";
import { getGitHubClient } from "@/lib/github/client";

// Each push costs an extra GitHub call to expand its commits, so a first sync
// over a busy 90 days needs more than the 10s default.
export const maxDuration = 60;

/** Pull the signed-in user's recent GitHub activity and store it. */
export async function POST() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const octokit = await getGitHubClient();
  if (!octokit) {
    return Response.json({ error: "No GitHub account linked" }, { status: 400 });
  }

  const userId = session.user.id;
  await markSyncStarted(userId);

  try {
    const events = await fetchRecentActivity(octokit);
    const stored = await storeActivity(userId, events);
    return Response.json(stored);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GitHub sync failed", error);
    // The reason is kept on the integration row, not sent to the client: it can
    // carry GitHub API detail.
    await markSyncFailed(userId, message);
    return Response.json({ error: "Sync failed" }, { status: 502 });
  }
}
