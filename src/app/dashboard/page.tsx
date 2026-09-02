import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiGitCommit,
  FiGithub,
  FiGitMerge,
  FiGitPullRequest,
} from "react-icons/fi";

import { ActivityHeatmap } from "@/components/activity-heatmap";
import { BrandLogo } from "@/components/brand-logo";
import { SignOutButton } from "@/components/sign-out-button";
import { SyncButton } from "@/components/sync-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getActivityOverview } from "@/db/queries/activity";
import type { ActivityType } from "@/db/schema/app";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const eventStyles: Record<ActivityType, { tone: string; icon: ReactNode }> = {
  commit: {
    tone: "border-event-commit/30 bg-event-commit/12 text-event-commit",
    icon: <FiGitCommit className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
  },
  pr_opened: {
    tone: "border-event-pr/30 bg-event-pr/12 text-event-pr",
    icon: (
      <FiGitPullRequest className="h-4 w-4" strokeWidth={1.75} aria-hidden />
    ),
  },
  pr_merged: {
    tone: "border-event-pr/30 bg-event-pr/12 text-event-pr",
    icon: <FiGitMerge className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
  },
  issue_opened: {
    tone: "border-event-star/30 bg-event-star/12 text-event-star",
    icon: <FiAlertCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
  },
  issue_closed: {
    tone: "border-event-branch/30 bg-event-branch/12 text-event-branch",
    icon: <FiCheckCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
  },
  review: {
    tone: "border-event-review/30 bg-event-review/12 text-event-review",
    icon: <FiEye className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
  },
};

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

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { user } = session;
  // GitHub display names can arrive padded (" Leyanne ").
  const name = user.name.trim();
  const firstName = name.split(/\s+/)[0] || name;
  const { integration, total, byType, recent, daily } = await getActivityOverview(
    user.id,
  );

  const stats = [
    { label: "Events", value: total },
    { label: "Commits", value: byType.get("commit") ?? 0 },
    {
      label: "Pull requests",
      value: (byType.get("pr_opened") ?? 0) + (byType.get("pr_merged") ?? 0),
    },
    { label: "Reviews", value: byType.get("review") ?? 0 },
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
            {user.image && (
              <Image
                src={user.image}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border border-glass-border"
              />
            )}
            <span className="hidden text-sm text-brand-200 sm:inline">
              {name}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-6 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hi {firstName}, you&apos;re in.
          </h1>
          <p className="mt-3 text-lg leading-8 text-brand-300">
            {integration?.lastSyncedAt
              ? `Last synced ${timeAgo(integration.lastSyncedAt)}.`
              : "Pull your GitHub activity and the board fills up."}
          </p>

          {integration?.status === "error" && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-state-error/30 bg-state-error/10 px-4 py-3 text-sm text-state-error"
            >
              The last sync didn&apos;t finish. Try again in a moment.
            </p>
          )}

          {total === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-card border border-glass-border bg-glass p-8 text-center backdrop-blur-xl sm:p-12">
              <span
                aria-hidden
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-glass-border bg-glass text-brand-200"
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
              <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-glass-border bg-glass px-4 py-4 backdrop-blur-xl"
                  >
                    <dt className="text-xs font-medium text-brand-400">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold tabular-nums text-brand-50">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6">
                <ActivityHeatmap days={daily} />
              </div>

              <section className="mt-6 rounded-card border border-glass-border bg-glass p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-brand-50">
                    Recent activity
                  </h2>
                  <SyncButton variant="secondary" />
                </div>

                <ul className="mt-5 flex flex-col gap-1.5">
                  {recent.map((event) => {
                    const style = eventStyles[event.type];

                    return (
                      <li key={event.id}>
                        <a
                          href={event.url ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-glass-border bg-glass px-3 py-2 transition-colors hover:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                        >
                          <span
                            aria-hidden
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${style.tone}`}
                          >
                            {style.icon}
                          </span>
                          <span className="truncate text-sm text-brand-200">
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
