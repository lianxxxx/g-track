import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  FiActivity,
  FiArrowDownRight,
  FiArrowUpRight,
  FiCalendar,
  FiFolder,
  FiGithub,
  FiGrid,
  FiLayers,
  FiZap,
} from "react-icons/fi";
import type { IconType } from "react-icons";

import { ActivityHeatmap, levelOf } from "@/components/activity-heatmap";
import { BarList } from "@/components/bar-list";
import { CardHeading } from "@/components/card-heading";
import { CodingHours } from "@/components/coding-hours";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { PeriodMenu } from "@/components/period-menu";
import { ContributionStrip, InkCurve, StreakBar } from "@/components/stat-charts";
import { SyncButton } from "@/components/sync-button";
import { getActivityOverview } from "@/db/queries/activity";
import { getSession } from "@/lib/auth";
import { parsePeriod, periods, summarizePeriod } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/* No fill: cards are a hairline on the grain canvas, same as the landing bento. */
const card = "rounded-card border border-glass-border";

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
/** Same window the query loads, so the longest streak covers everything on the heatmap. */
const HEATMAP_DAYS = 371;

/** A little roast about how stale the board is, in the same voice as the home page recap. */
function syncQuip(lastSyncedAt: Date) {
  const age = Date.now() - lastSyncedAt.getTime();
  if (age < DAY_MS / 24) return "Fresh. Go touch grass.";
  if (age < DAY_MS) return "Still warm.";
  if (age < 7 * DAY_MS) return "Close enough.";
  return "The board misses you.";
}
const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type MonthTrend = { percent: number | null; up: boolean; note: string };

/** Last 14 days as heatmap levels, streaks, the month trend, and per-weekday totals (Monday first). */
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

  let longestStreak = 0;
  let run = 0;
  for (let daysAgo = HEATMAP_DAYS - 1; daysAgo >= 0; daysAgo--) {
    run = countOn(daysAgo) > 0 ? run + 1 : 0;
    longestStreak = Math.max(longestStreak, run);
  }

  // Month to date against the same stretch of last month, so a fresh month isn't unfairly behind.
  const dayOfMonth = now.getUTCDate();
  const lastMonthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
  let thisMonth = 0;
  let lastMonth = 0;
  for (let day = 1; day <= dayOfMonth; day++) {
    thisMonth += countOn(dayOfMonth - day);
    if (day <= lastMonthEnd.getUTCDate()) {
      lastMonth +=
        counts.get(
          new Date(Date.UTC(lastMonthEnd.getUTCFullYear(), lastMonthEnd.getUTCMonth(), day))
            .toISOString()
            .slice(0, 10),
        ) ?? 0;
    }
  }
  const monthName = lastMonthEnd.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const monthTrend: MonthTrend =
    lastMonth === 0
      ? {
          percent: null,
          up: thisMonth > 0,
          note: thisMonth > 0 ? `Up from 0 in ${monthName}` : `Quiet since ${monthName}`,
        }
      : {
          percent: Math.round((Math.abs(thisMonth - lastMonth) / lastMonth) * 100),
          up: thisMonth >= lastMonth,
          note: `vs ${monthName}, same days`,
        };

  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  for (const entry of daily) {
    const weekday = new Date(`${entry.day}T00:00:00Z`).getUTCDay();
    weekdayTotals[(weekday + 6) % 7] += entry.count;
  }
  const peak = Math.max(...weekdayTotals);
  const busiestDay = peak > 0 ? weekdayNames[weekdayTotals.indexOf(peak)] : "None";

  return { recentLevels, streak, longestStreak, monthTrend, weekdayTotals, busiestDay };
}

/** Events per hour (a 1-day window) or per day, oldest first, for the hero's ink line. */
function bucketize(events: { occurredAt: Date }[], days: number) {
  const size = days === 1 ? DAY_MS / 24 : DAY_MS;
  const buckets = Array.from({ length: days === 1 ? 24 : days }, () => 0);
  const now = Date.now();
  for (const event of events) {
    const index = buckets.length - 1 - Math.floor((now - event.occurredAt.getTime()) / size);
    if (index >= 0) buckets[index]++;
  }
  return buckets;
}

/** Mono delta pill: an arrow and a percent, no green or red. */
function TrendBadge({ trend }: { trend: MonthTrend }) {
  if (trend.percent === null) return null;
  const Arrow = trend.up ? FiArrowUpRight : FiArrowDownRight;

  return (
    <span className="flex items-center gap-0.5 rounded-full border border-glass-border px-2 py-0.5 text-xs text-brand-100 tabular-nums">
      <Arrow className="h-3 w-3" strokeWidth={2} aria-hidden />
      <span className="sr-only">{trend.up ? "Up" : "Down"} </span>
      {trend.percent}%
    </span>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { user } = session;
  // GitHub display names can arrive padded (" Leyanne ").
  const name = user.name.trim();
  const firstName = name.split(/\s+/)[0] || name;
  const period = parsePeriod((await searchParams).period);
  const { integration, total, daily, windowed } = await getActivityOverview(user.id);

  const { recentLevels, streak, longestStreak, monthTrend, weekdayTotals, busiestDay } =
    summarize(daily);
  const insights = summarizePeriod(period, windowed);
  const commitTimes = windowed
    .filter((event) => event.type === "commit")
    .map((event) => event.occurredAt.toISOString());

  const heroLine = bucketize(insights.events, period.days);

  const stats: {
    label: string;
    icon: IconType;
    value: string;
    unit?: string;
    badge?: ReactNode;
    note: string;
    chart: ReactNode;
  }[] = [
    {
      label: "Contributions",
      icon: FiActivity,
      value: total.toLocaleString("en-US"),
      badge: <TrendBadge trend={monthTrend} />,
      note: monthTrend.note,
      chart: <ContributionStrip levels={recentLevels} />,
    },
    {
      label: "Current streak",
      icon: FiZap,
      value: String(streak),
      unit: streak === 1 ? "day" : "days",
      note: `Best: ${longestStreak} ${longestStreak === 1 ? "day" : "days"}`,
      chart: <StreakBar streak={streak} goal={STREAK_GOAL} />,
    },
    {
      label: "Busiest day",
      icon: FiCalendar,
      value: busiestDay,
      note: "Most active weekday this year",
      chart: (
        <div className="w-24 text-brand-50">
          <InkCurve values={weekdayTotals} arrow />
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
      <DashboardSidebar name={name} email={user.email} image={user.image ?? null} />

      <main className="min-w-0 flex-1 px-6 pb-24 pt-8 lg:pl-6 lg:pr-3 lg:pt-10">
        <div className="w-full">
          <div className="min-w-0 flex-1">
            <section id="overview" className="scroll-mt-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {user.image && (
                    <Image
                      src={user.image}
                      alt=""
                      width={56}
                      height={56}
                      className="h-12 w-12 shrink-0 rounded-full sm:h-14 sm:w-14"
                    />
                  )}
                  <div>
                    <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-brand-50 sm:text-4xl">
                      Hi, <span className="italic">{firstName}!</span>
                    </h1>
                    <p className="mt-1 text-sm text-brand-300">
                      {integration?.lastSyncedAt ? (
                        <>
                          Synced {timeAgo(integration.lastSyncedAt)}.{" "}
                          {syncQuip(integration.lastSyncedAt)}
                        </>
                      ) : (
                        "Pull your GitHub activity and the board fills up."
                      )}
                    </p>
                  </div>
                </div>
                {/* The empty state below has its own sync button, so these only show once there's data. */}
                {total > 0 && (
                  <div className="flex shrink-0 items-start gap-2">
                    <PeriodMenu
                      options={periods.map(({ key, label }) => ({ key, label }))}
                      current={period.key}
                    />
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

              {total > 0 && (
                // Reads top-down: the number, then the roast in a quieter voice. The period is in the dropdown.
                // The window's ink line sits beside it as the picture, not under it as a rule.
                <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,24rem)_1fr] md:items-end md:gap-12">
                  <div>
                    <p className="flex items-baseline gap-2">
                      <span className="font-heading text-6xl font-semibold leading-none tracking-tight text-brand-50 tabular-nums">
                        {insights.total}
                      </span>
                      <span className="text-base text-brand-300">
                        {insights.total === 1 ? "event" : "events"}
                      </span>
                    </p>
                    <p className="mt-4 text-balance text-sm text-brand-300">
                      {insights.roast}
                    </p>
                  </div>

                  {insights.total > 0 && (
                    <div aria-hidden className="text-brand-50">
                      <InkCurve values={heroLine} width={300} height={60} className="h-24" />
                    </div>
                  )}
                </div>
              )}
            </section>

            {total === 0 ? (
              <div className={`${card} mt-12 flex flex-col items-center p-8 text-center sm:p-12`}>
                <span
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-glass-border text-brand-100"
                >
                  <FiGithub className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h2 className="mt-5 text-lg font-semibold text-brand-50">Nothing synced yet</h2>
                <p className="mt-2 max-w-sm leading-7 text-brand-300">
                  Your commits, pull requests, issues, and reviews land here. GitHub keeps about
                  90 days of activity, so the first sync covers roughly the last three months.
                </p>
                <div className="mt-7">
                  <SyncButton label="Sync my activity" />
                </div>
              </div>
            ) : (
              <>
                <div className="mt-10 grid gap-3 md:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className={`${card} flex flex-col gap-6 p-5`}>
                      <CardHeading icon={stat.icon} title={stat.label} aside={stat.badge} />
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="flex items-baseline gap-1.5">
                            <span className="font-heading text-3xl font-semibold tracking-tight text-brand-50 tabular-nums">
                              {stat.value}
                            </span>
                            {stat.unit && (
                              <span className="text-xs text-brand-400">{stat.unit}</span>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-brand-400">{stat.note}</p>
                        </div>
                        <div aria-hidden>{stat.chart}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <section
                  id="heatmap"
                  aria-labelledby="heatmap-heading"
                  className={`${card} mt-3 scroll-mt-10 p-5 sm:p-6`}
                >
                  <CardHeading id="heatmap-heading" icon={FiGrid} title="Contributions" meta="Past year" />
                  <div className="mt-6">
                    <ActivityHeatmap days={daily} />
                  </div>
                </section>

                <section
                  id="insights"
                  aria-label="Insights"
                  className="mt-3 grid scroll-mt-10 gap-3 md:grid-cols-2"
                >
                  <div className={`${card} flex flex-col gap-6 p-5 sm:p-6`}>
                    <CardHeading icon={FiLayers} title="By type" meta={period.label} />
                    <BarList rows={insights.byType} empty="No activity in this window." />
                  </div>
                  <div className={`${card} flex flex-col gap-6 p-5 sm:p-6`}>
                    <CardHeading icon={FiFolder} title="Top repos" meta={period.label} />
                    <BarList
                      rows={insights.repos}
                      total={insights.total}
                      empty="No repos in this window."
                    />
                  </div>
                </section>

                <div id="hours" className="mt-3 scroll-mt-10">
                  <CodingHours commitTimes={commitTimes} />
                </div>

                <p className="mt-4 text-xs text-brand-400">
                  Contributions and streaks cover your full GitHub year. Everything else uses your
                  public GitHub events from the last 90 days.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
