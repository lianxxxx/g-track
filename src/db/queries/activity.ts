import { and, asc, desc, eq, gte, notInArray, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  activityEvents,
  contributionDays,
  integrations,
  projects,
} from "@/db/schema/app";
import type { NormalizedEvent } from "@/lib/github/activity";
import type { ContributionDay } from "@/lib/github/contributions";

/** Upsert the per-user GitHub integration row. */
function saveIntegration(
  userId: string,
  values: {
    status: "idle" | "syncing" | "error";
    lastSyncedAt?: Date;
    errorMessage: string | null;
  },
) {
  return db
    .insert(integrations)
    .values({ userId, source: "github", ...values })
    .onConflictDoUpdate({
      target: [integrations.userId, integrations.source],
      set: { ...values, updatedAt: new Date() },
    });
}

export function markSyncStarted(userId: string) {
  return saveIntegration(userId, { status: "syncing", errorMessage: null });
}

export function markSyncFailed(userId: string, message: string) {
  return saveIntegration(userId, { status: "error", errorMessage: message });
}

function markSynced(userId: string) {
  return saveIntegration(userId, {
    status: "idle",
    lastSyncedAt: new Date(),
    errorMessage: null,
  });
}

/**
 * Store a batch of normalized events for a user.
 *
 * neon-http has no transactions, so every step is idempotent and ordered to
 * stay safe if a later one fails: projects and events dedup on their unique
 * indexes, rebased commit copies are pruned after the insert, and the
 * integration row is marked synced last.
 */
export async function storeActivity(userId: string, events: NormalizedEvent[]) {
  const repos = new Map(
    events.map((event) => [event.repo.externalId, event.repo]),
  );
  // The same commit can arrive in two push events; a batch inserts it once.
  const unique = new Map(events.map((event) => [event.externalId, event]));

  if (unique.size === 0) {
    await markSynced(userId);
    return { projects: 0, events: 0 };
  }

  const storedProjects = await db
    .insert(projects)
    .values(
      [...repos.values()].map((repo) => ({
        userId,
        name: repo.name,
        fullName: repo.fullName,
        externalId: repo.externalId,
      })),
    )
    .onConflictDoUpdate({
      target: [projects.userId, projects.externalId],
      set: { name: sql`excluded.name`, fullName: sql`excluded.full_name` },
    })
    .returning({ id: projects.id, externalId: projects.externalId });

  const projectIds = new Map(
    storedProjects.map((project) => [project.externalId, project.id]),
  );

  const rows = [...unique.values()].flatMap((event) => {
    const projectId = projectIds.get(event.repo.externalId);
    if (!projectId) return [];

    return [
      {
        userId,
        projectId,
        source: "github" as const,
        type: event.type,
        title: event.title,
        url: event.url,
        occurredAt: event.occurredAt,
        externalId: event.externalId,
      },
    ];
  });

  const inserted = await db
    .insert(activityEvents)
    .values(rows)
    .onConflictDoNothing({
      target: [
        activityEvents.userId,
        activityEvents.source,
        activityEvents.externalId,
      ],
    })
    .returning({ id: activityEvents.id });

  await removeRebasedCommits(userId);

  await markSynced(userId);

  return { projects: storedProjects.length, events: inserted.length };
}

function toUtcDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * A rebase or amend gives a commit a new sha but keeps its authored date and
 * message, and the Events API reports both the old and the new push. Keep the
 * first stored copy per (project, authored date, subject) and delete the rest.
 * Keeping the oldest row means an old sha fetched again later is the one that
 * goes, so the result is stable across syncs.
 */
async function removeRebasedCommits(userId: string) {
  const ownCommits = and(
    eq(activityEvents.userId, userId),
    eq(activityEvents.type, "commit"),
  );

  const firstCopies = db
    .selectDistinctOn(
      [activityEvents.projectId, activityEvents.occurredAt, activityEvents.title],
      { id: activityEvents.id },
    )
    .from(activityEvents)
    .where(ownCommits)
    .orderBy(
      activityEvents.projectId,
      activityEvents.occurredAt,
      activityEvents.title,
      asc(activityEvents.createdAt),
      asc(activityEvents.id),
    );

  await db
    .delete(activityEvents)
    .where(and(ownCommits, notInArray(activityEvents.id, firstCopies)));
}

/**
 * Upsert a user's contribution calendar. GitHub returns the whole year every
 * time, so each day's count is overwritten with the latest value. Idempotent,
 * so a failed sync can simply run again.
 */
export async function storeContributionDays(
  userId: string,
  days: ContributionDay[],
) {
  if (days.length === 0) return;

  await db
    .insert(contributionDays)
    .values(days.map((entry) => ({ userId, day: entry.day, count: entry.count })))
    .onConflictDoUpdate({
      target: [contributionDays.userId, contributionDays.day],
      set: { count: sql`excluded.count`, updatedAt: new Date() },
    });
}

/** The heatmap window: 52 weeks plus the current partial week. */
const HEATMAP_DAYS = 371;

/** How far back the Events API reaches, so the insights window never claims more. */
export const INSIGHTS_DAYS = 90;

/** Everything the dashboard board renders: totals, sync state, the heatmap year, and the 90-day event window. */
export async function getActivityOverview(userId: string) {
  const [integration] = await db
    .select({
      status: integrations.status,
      lastSyncedAt: integrations.lastSyncedAt,
      errorMessage: integrations.errorMessage,
    })
    .from(integrations)
    .where(
      and(eq(integrations.userId, userId), eq(integrations.source, "github")),
    )
    .limit(1);

  // Heatmap and stats come from the contribution calendar: a full year,
  // private contributions included, matching the user's GitHub profile.
  const daily = await db
    .select({ day: contributionDays.day, count: contributionDays.count })
    .from(contributionDays)
    .where(
      and(
        eq(contributionDays.userId, userId),
        gte(
          contributionDays.day,
          toUtcDay(new Date(Date.now() - HEATMAP_DAYS * 86_400_000)),
        ),
      ),
    );

  // Insights, coding hours, and the activity panel: every event in the window,
  // newest first. 90 days of one person's activity is a few hundred rows, small
  // enough to summarize in the page.
  const windowed = await db
    .select({
      id: activityEvents.id,
      type: activityEvents.type,
      title: activityEvents.title,
      url: activityEvents.url,
      occurredAt: activityEvents.occurredAt,
      project: projects.name,
    })
    .from(activityEvents)
    .innerJoin(projects, eq(activityEvents.projectId, projects.id))
    .where(
      and(
        eq(activityEvents.userId, userId),
        gte(
          activityEvents.occurredAt,
          new Date(Date.now() - INSIGHTS_DAYS * 86_400_000),
        ),
      ),
    )
    .orderBy(desc(activityEvents.occurredAt));

  return {
    integration: integration ?? null,
    total: daily.reduce((sum, row) => sum + row.count, 0),
    daily,
    windowed,
  };
}
