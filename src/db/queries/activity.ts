import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  activityEvents,
  dailyStats,
  integrations,
  projects,
} from "@/db/schema/app";
import type { NormalizedEvent } from "@/lib/github/activity";

/** The UTC calendar day of an event, matching daily_stats.day. */
const utcDay = sql<string>`(${activityEvents.occurredAt} AT TIME ZONE 'utc')::date`;

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
 * Store a batch of normalized events for a user and refresh their aggregates.
 *
 * neon-http has no transactions, so every step is idempotent and ordered to
 * stay safe if a later one fails: projects and events dedup on their unique
 * indexes, daily_stats is recomputed from the stored events rather than
 * incremented, and the integration row is marked synced last.
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

  const days = [...new Set(rows.map((row) => toUtcDay(row.occurredAt)))];
  await recomputeDailyStats(userId, days);

  await markSynced(userId);

  return { projects: storedProjects.length, events: inserted.length };
}

function toUtcDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Recount the given days from activity_events. Events are only ever added, so
 * counts only grow and no stale rows are left behind.
 */
async function recomputeDailyStats(userId: string, days: string[]) {
  if (days.length === 0) return;

  const counts = await db
    .select({
      day: utcDay.as("day"),
      type: activityEvents.type,
      count: sql<number>`count(*)::int`,
    })
    .from(activityEvents)
    .where(and(eq(activityEvents.userId, userId), inArray(utcDay, days)))
    .groupBy(utcDay, activityEvents.type);

  if (counts.length === 0) return;

  await db
    .insert(dailyStats)
    .values(counts.map((row) => ({ userId, ...row })))
    .onConflictDoUpdate({
      target: [dailyStats.userId, dailyStats.day, dailyStats.type],
      set: { count: sql`excluded.count`, updatedAt: new Date() },
    });
}

/** The heatmap window: 52 weeks plus the current partial week. */
const HEATMAP_DAYS = 371;

/** Everything the dashboard board renders: totals, sync state, recent events. */
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

  const totals = await db
    .select({ type: activityEvents.type, count: sql<number>`count(*)::int` })
    .from(activityEvents)
    .where(eq(activityEvents.userId, userId))
    .groupBy(activityEvents.type);

  const recent = await db
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
    .where(eq(activityEvents.userId, userId))
    .orderBy(desc(activityEvents.occurredAt))
    .limit(8);

  const daily = await db
    .select({
      day: dailyStats.day,
      count: sql<number>`sum(${dailyStats.count})::int`,
    })
    .from(dailyStats)
    .where(
      and(
        eq(dailyStats.userId, userId),
        gte(
          dailyStats.day,
          toUtcDay(new Date(Date.now() - HEATMAP_DAYS * 86_400_000)),
        ),
      ),
    )
    .groupBy(dailyStats.day);

  return {
    integration: integration ?? null,
    total: totals.reduce((sum, row) => sum + row.count, 0),
    byType: new Map(totals.map((row) => [row.type, row.count])),
    recent,
    daily,
  };
}
