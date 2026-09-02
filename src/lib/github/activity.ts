import type { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { z } from "zod";

import type { ActivityType } from "@/db/schema/app";

type GitHubEvent =
  RestEndpointMethodTypes["activity"]["listEventsForAuthenticatedUser"]["response"]["data"][number];

/** One activity_events row, minus the ids the database layer resolves. */
export type NormalizedEvent = {
  type: ActivityType;
  title: string | null;
  url: string | null;
  occurredAt: Date;
  externalId: string;
  repo: { externalId: string; name: string; fullName: string };
};

/** A first push to a new branch has no parent to compare against. */
const EMPTY_SHA = "0".repeat(40);

/** Pushes are expanded one API call each, so they go out in small batches. */
const PUSH_CONCURRENCY = 8;

/**
 * The payload fields we read. Octokit's generated types follow GitHub's docs,
 * which describe less than the API returns: pull-request-minimal has no title,
 * html_url or merged. Validating the few fields we consume beats casting past
 * the types.
 */
const pushPayload = z.object({
  before: z.string(),
  head: z.string(),
});

const pullRequestPayload = z.object({
  action: z.string(),
  pull_request: z.object({
    title: z.string(),
    html_url: z.string(),
    merged: z.boolean().nullish(),
  }),
});

const issuesPayload = z.object({
  action: z.string(),
  issue: z.object({
    title: z.string(),
    html_url: z.string(),
  }),
});

const reviewPayload = z.object({
  action: z.string(),
  review: z.object({ html_url: z.string() }),
  pull_request: z.object({ title: z.string().nullish() }),
});

/** The Events API reports a repo as `{ id, name: "owner/repo" }`. */
function repoOf(event: GitHubEvent) {
  const fullName = event.repo.name;
  return {
    externalId: String(event.repo.id),
    name: fullName.split("/").at(-1) ?? fullName,
    fullName,
  };
}

/**
 * Map one GitHub event to a normalized event. Pushes are handled separately
 * (see expandPush), and anything we don't track - forks, stars, comments -
 * maps to nothing.
 *
 * External ids: commits use their sha, which is stable no matter which
 * endpoint they came from. Other types use the event id, which is unique
 * within the Events API - a later backfill from another endpoint would need to
 * key those the same way to stay deduped.
 */
export function normalizeEvent(event: GitHubEvent): NormalizedEvent[] {
  if (!event.created_at) return [];

  const occurredAt = new Date(event.created_at);
  const repo = repoOf(event);
  const base = { occurredAt, repo };

  switch (event.type) {
    case "PullRequestEvent": {
      const parsed = pullRequestPayload.safeParse(event.payload);
      if (!parsed.success) return [];

      const { action, pull_request: pullRequest } = parsed.data;
      const type: ActivityType | null =
        action === "opened"
          ? "pr_opened"
          : action === "closed" && pullRequest.merged
            ? "pr_merged"
            : null;
      if (!type) return [];

      return [
        {
          ...base,
          type,
          title: pullRequest.title,
          url: pullRequest.html_url,
          externalId: event.id,
        },
      ];
    }

    case "IssuesEvent": {
      const parsed = issuesPayload.safeParse(event.payload);
      if (!parsed.success) return [];

      const { action, issue } = parsed.data;
      const type: ActivityType | null =
        action === "opened"
          ? "issue_opened"
          : action === "closed"
            ? "issue_closed"
            : null;
      if (!type) return [];

      return [
        {
          ...base,
          type,
          title: issue.title,
          url: issue.html_url,
          externalId: event.id,
        },
      ];
    }

    case "PullRequestReviewEvent": {
      const parsed = reviewPayload.safeParse(event.payload);
      if (!parsed.success || parsed.data.action !== "created") return [];

      return [
        {
          ...base,
          type: "review" as const,
          title: parsed.data.pull_request.title ?? null,
          url: parsed.data.review.html_url,
          externalId: event.id,
        },
      ];
    }

    default:
      return [];
  }
}

/** The commit fields we store, shared by the compare and single-commit calls. */
type CommitLike = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date?: string } | null };
  // GitHub returns an empty object for a commit it can't attribute to a user.
  author: { login?: string } | null;
};

/**
 * A PushEvent payload only names its range (`before...head`), so the commits
 * themselves are fetched per push. Compare returns at most 250 commits, which
 * no ordinary push exceeds.
 */
async function expandPush(
  octokit: Octokit,
  event: GitHubEvent,
  login: string,
): Promise<NormalizedEvent[]> {
  const parsed = pushPayload.safeParse(event.payload);
  if (!parsed.success || !event.created_at) return [];

  const pushedAt = event.created_at;
  const { before, head } = parsed.data;
  const repo = repoOf(event);
  const [owner, name] = repo.fullName.split("/");
  if (!owner || !name) return [];

  try {
    const commits: CommitLike[] =
      before === EMPTY_SHA
        ? [
            (await octokit.rest.repos.getCommit({ owner, repo: name, ref: head }))
              .data,
          ]
        : (
            await octokit.rest.repos.compareCommits({
              owner,
              repo: name,
              base: before,
              head,
            })
          ).data.commits;

    return (
      commits
        // A push can carry other people's commits (merging their pull request),
        // so only the user's own count as their activity.
        .filter((commit) => commit.author?.login === login)
        .map((commit) => ({
          repo,
          type: "commit" as const,
          title: commit.commit.message.split("\n")[0] || null,
          url: commit.html_url,
          // The authored date, so the heatmap matches GitHub's own calendar.
          occurredAt: new Date(commit.commit.author?.date ?? pushedAt),
          externalId: commit.sha,
        }))
    );
  } catch {
    // A force-pushed or deleted range no longer compares. One push failing
    // shouldn't sink the whole sync.
    return [];
  }
}

/**
 * The signed-in user's recent activity, normalized.
 *
 * GitHub's Events API only reaches back about 90 days and 300 events, so this
 * is a rolling window, not a full history.
 */
export async function fetchRecentActivity(
  octokit: Octokit,
): Promise<NormalizedEvent[]> {
  const { data: viewer } = await octokit.rest.users.getAuthenticated();

  const events = await octokit.paginate(
    octokit.rest.activity.listEventsForAuthenticatedUser,
    { username: viewer.login, per_page: 100 },
  );

  const normalized = events.flatMap(normalizeEvent);
  const pushes = events.filter((event) => event.type === "PushEvent");

  for (let index = 0; index < pushes.length; index += PUSH_CONCURRENCY) {
    const batch = pushes.slice(index, index + PUSH_CONCURRENCY);
    const expanded = await Promise.all(
      batch.map((event) => expandPush(octokit, event, viewer.login)),
    );
    normalized.push(...expanded.flat());
  }

  return normalized;
}
