import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiGitCommit,
  FiGithub,
  FiGitMerge,
  FiGitPullRequest,
} from "react-icons/fi";

import { ActivityHeatmap, levelOf } from "@/components/activity-heatmap";
import { BrandLogo } from "@/components/brand-logo";
import { ContributionStrip, StreakTicks, WeekdayBars } from "@/components/stat-charts";
import { SyncButton } from "@/components/sync-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { getActivityOverview } from "@/db/queries/activity";
import type { ActivityType } from "@/db/schema/app";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/* Neutral outlined icons, same as the home page: type reads from the icon, not a color. */
const eventIcon: Record<ActivityType, IconType> = {
  commit: FiGitCommit,
  pr_opened: FiGitPullRequest,
  pr_merged: FiGitMerge,
  issue_opened: FiAlertCircle,
  issue_closed: FiCheckCircle,
  review: FiEye,
};

const card = "rounded-card border border-glass-border bg-brand-950";

const eventLabel: Record<ActivityType, string> = {
  commit: "Commit",
  pr_opened: "Opened",
  pr_merged: "Merged",
  issue_opened: "Issue",
  issue_closed: "Closed",
  review: "Reviewed",
};

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** "3 hours ago". Server-rendered, so there is no client clock to disagree with. */
function timeAgo(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);

  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return relative.format(Math.round(seconds / size), unit);
    }
  }

  return relative.format(Math.round(seconds), "second");
}

const DAY_MS = 86_400_000;
const STREAK_GOAL = 30;

/** A little roast about how stale the board is, in the same voice as the home page recap. */
function syncQuip(lastSyncedAt: Date) {
  const age = Date.now() - lastSyncedAt.getTime();
  if (age < DAY_MS / 24) return "Fresh. Go touch grass.";
  if (age < DAY_MS) return "Still warm.";
  if (age < 7 * DAY_MS) return "Close enough.";
  return "The board misses you.";
}
const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Last 14 days as heatmap levels, the current streak, and per-weekday totals (Monday first). */
function summarize(daily: { day: string; count: number }[]) {
  const counts = new Map(daily.map((entry) => [entry.day, entry.count]));
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const countOn = (daysAgo: number) =>
    counts.get(new Date(today - daysAgo * DAY_MS).toISOString().slice(0, 10)) ?? 0;

  const recentLevels = Array.from({ length: 14 }, (_, index) => levelOf(countOn(13 - index)));

  // Today still counts toward the streak until it's over, so an empty today starts from yesterday.
  let streak = 0;
  for (let daysAgo = countOn(0) > 0 ? 0 : 1; countOn(daysAgo) > 0; daysAgo++) streak++;

  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  for (const entry of daily) {
    const weekday = new Date(`${entry.day}T00:00:00Z`).getUTCDay();
    weekdayTotals[(weekday + 6) % 7] += entry.count;
  }
  const peak = Math.max(...weekdayTotals);
  const busiestDay = peak > 0 ? weekdayNames[weekdayTotals.indexOf(peak)] : "None";

  return { recentLevels, streak, weekdayTotals, busiestDay };
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { user } = session;
  // GitHub display names can arrive padded (" Leyanne ").
  const name = user.name.trim();
  const firstName = name.split(/\s+/)[0] || name;
  const { integration, total, recent, daily } = await getActivityOverview(
    user.id,
  );

  const { recentLevels, streak, weekdayTotals, busiestDay } = summarize(daily);

  const stats: { label: string; value: string; unit?: string; chart: ReactNode }[] = [
    {
      label: "Contributions",
      value: total.toLocaleString("en-US"),
      chart: <ContributionStrip levels={recentLevels} />,
    },
    {
      label: "Current streak",
      value: String(streak),
      unit: streak === 1 ? "day" : "days",
      chart: <StreakTicks streak={streak} goal={STREAK_GOAL} />,
    },
    {
      label: "Busiest day",
      value: busiestDay,
      chart: <WeekdayBars totals={weekdayTotals} />,
    },
  ];

  return (
    <>
      <header className="mt-6">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex w-fit items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
          >
            <BrandLogo priority />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu name={name} email={user.email} image={user.image ?? null} />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-6 pb-24 pt-14 sm:pt-20">
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-brand-50 sm:text-5xl">
                Hi {firstName}, you&apos;re <span className="italic">in.</span>
              </h1>
              <p className="mt-4 text-pretty text-lg leading-8 text-brand-300">
                {integration?.lastSyncedAt ? (
                  <>
                    Last synced{" "}
                    <span className="font-medium text-brand-50">
                      {timeAgo(integration.lastSyncedAt)}
                    </span>
                    . {syncQuip(integration.lastSyncedAt)}
                  </>
                ) : (
                  "Pull your GitHub activity and the board fills up."
                )}
              </p>
            </div>
            {/* The empty state below has its own sync button, so this only shows once there's data. */}
            {total > 0 && (
              <div className="shrink-0 self-start sm:self-auto">
                <SyncButton />
              </div>
            )}
          </div>

          {integration?.status === "error" && (
            <p
              role="alert"
              className="mt-8 rounded-xl border border-state-error/30 bg-state-error/10 px-4 py-3 text-sm text-state-error"
            >
              The last sync didn&apos;t finish. Try again in a moment.
            </p>
          )}

          {total === 0 ? (
            <div className={`${card} mt-12 flex flex-col items-center p-8 text-center sm:p-12`}>
              <span
                aria-hidden
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-glass-border text-brand-100"
              >
                <FiGithub className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-brand-50">
                Nothing synced yet
              </h2>
              <p className="mt-2 max-w-sm leading-7 text-brand-300">
                Your commits, pull requests, issues, and reviews land here.
                GitHub keeps about 90 days of activity, so the first sync covers
                roughly the last three months.
              </p>
              <div className="mt-7">
                <SyncButton label="Sync my activity" />
              </div>
            </div>
          ) : (
            <>
              <dl className="mt-12 grid gap-3 md:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`${card} flex items-center justify-between gap-2 px-5 py-4 sm:flex-col sm:items-stretch sm:gap-1 sm:px-6`}
                  >
                    <dt className="text-sm text-brand-300 sm:text-xs sm:text-brand-400">
                      {stat.label}
                    </dt>
                    <dd className="flex items-end justify-between gap-4">
                      <span className="flex items-baseline gap-1.5">
                        <span className="font-heading text-2xl font-semibold tracking-tight text-brand-50 tabular-nums sm:text-3xl">
                          {stat.value}
                        </span>
                        {stat.unit && (
                          <span className="text-xs text-brand-400">{stat.unit}</span>
                        )}
                      </span>
                      <span aria-hidden className="hidden sm:block">
                        {stat.chart}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-12">
                <ActivityHeatmap days={daily} />
              </div>

              <section className={`${card} mt-12 p-5 sm:p-6`}>
                <h2 className="text-sm font-medium text-brand-50">
                  Recent activity
                </h2>

                <ul className="mt-2 flex flex-col divide-y divide-glass-border">
                  {recent.map((event) => {
                    const Icon = eventIcon[event.type];

                    return (
                      <li key={event.id}>
                        <a
                          href={event.url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-brand-800/60 focus-visible:outline-2 focus-visible:outline-accent-primary light:hover:bg-brand-900/60"
                        >
                          <span
                            aria-hidden
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-glass-border text-brand-300"
                          >
                            <Icon className="h-4 w-4" strokeWidth={1.75} />
                          </span>
                          <span className="truncate text-sm text-brand-100">
                            <span className="sr-only">
                              {eventLabel[event.type]}:{" "}
                            </span>
                            {event.title ?? eventLabel[event.type]}
                          </span>
                          <span className="ml-auto hidden shrink-0 font-mono text-xs text-brand-400 sm:inline">
                            {event.project}
                          </span>
                          <span className="shrink-0 text-xs text-brand-400 tabular-nums">
                            {timeAgo(event.occurredAt)}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
