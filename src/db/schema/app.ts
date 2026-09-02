import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

/** Activity sources. GitHub only for now; future sources are added here when actually built. */
export const activitySource = pgEnum("activity_source", ["github"]);

export const activityType = pgEnum("activity_type", [
  "commit",
  "pr_opened",
  "pr_merged",
  "issue_opened",
  "issue_closed",
  "review",
]);

/** The activity types the app tracks, derived from the enum above. */
export type ActivityType = (typeof activityType.enumValues)[number];

export const integrationStatus = pgEnum("integration_status", [
  "idle",
  "syncing",
  "error",
]);

/** The unit activity is attributed to - a GitHub repository for now. */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Repository name, e.g. "g-track". */
    name: text("name").notNull(),
    /** Full name including owner, e.g. "lianxxxx/g-track". */
    fullName: text("full_name").notNull(),
    /** Source-side identifier (GitHub repository id) for dedup across syncs. */
    externalId: text("external_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("projects_user_external_idx").on(t.userId, t.externalId)],
);

/** Normalized event model - the core of the system. Every source feeds this table. */
export const activityEvents = pgTable(
  "activity_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    source: activitySource("source").notNull(),
    type: activityType("type").notNull(),
    /** Short human-readable label: commit message subject, PR/issue title. */
    title: text("title"),
    /** Link to the event on the source, e.g. a commit or PR URL. */
    url: text("url"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    /**
     * Source-side identifier for dedup, unique per (user, source).
     * Contract: must be globally unique within the source - use GitHub's
     * node_id / Events API id, never a per-repo number (PR/issue number).
     */
    externalId: text("external_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("activity_events_user_source_external_idx").on(
      t.userId,
      t.source,
      t.externalId,
    ),
    index("activity_events_user_occurred_idx").on(t.userId, t.occurredAt),
  ],
);

/**
 * Per-user, per-day, per-type aggregates derived from activity_events. Powers
 * the heatmap. Note: deleting a project cascades its activity_events away but
 * not these rows - a project-removal flow must recompute the affected user's
 * aggregates in the same operation.
 */
export const dailyStats = pgTable(
  "daily_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** UTC calendar day of occurred_at. */
    day: date("day").notNull(),
    type: activityType("type").notNull(),
    count: integer("count").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("daily_stats_user_day_type_idx").on(t.userId, t.day, t.type)],
);

/** Per-user, per-source connection and sync cursor. Makes fetches incremental and failures visible. */
export const integrations = pgTable(
  "integrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    source: activitySource("source").notNull(),
    status: integrationStatus("status").notNull().default("idle"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    /** Opaque cursor into the source's event stream (e.g. last seen GitHub event id). */
    syncCursor: text("sync_cursor"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("integrations_user_source_idx").on(t.userId, t.source)],
);
