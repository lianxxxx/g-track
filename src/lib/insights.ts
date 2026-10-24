import { activityType, type ActivityType } from "@/db/schema/app";

type WindowEvent = { type: ActivityType; occurredAt: Date; project: string };

export type PeriodKey = "day" | "week" | "quarter";

/** Rolling windows, so "today" never depends on whose timezone the server is in. */
export const periods: { key: PeriodKey; label: string; days: number }[] = [
  { key: "day", label: "Last 24 hours", days: 1 },
  { key: "week", label: "Last 7 days", days: 7 },
  { key: "quarter", label: "Last 90 days", days: 90 },
];

/** The `?period=` value from the URL, falling back to the week for anything unknown. */
export function parsePeriod(value: string | string[] | undefined) {
  return periods.find((period) => period.key === value) ?? periods[1];
}

const typeLabels: Record<ActivityType, string> = {
  commit: "Commits",
  pr_opened: "PRs opened",
  pr_merged: "PRs merged",
  review: "Reviews",
  issue_opened: "Issues opened",
  issue_closed: "Issues closed",
};

/** Enough repos to show where the work went without turning into a list. */
const TOP_REPOS = 4;

/** Commits that make the board say "touch grass", per window. */
const grindThreshold: Record<PeriodKey, number> = { day: 10, week: 40, quarter: 200 };

const quietLine: Record<PeriodKey, string> = {
  day: "Nothing in 24 hours. Resting or hiding?",
  week: "A whole week of silence. The board misses you.",
  quarter: "90 days, zero events. Is this thing on?",
};

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

/** One line of board voice about a window, picked from what stands out most. */
function roastFor(period: PeriodKey, count: (type: ActivityType) => number, total: number) {
  const commits = count("commit");
  const prs = count("pr_opened") + count("pr_merged");
  const reviews = count("review");
  const merged = count("pr_merged");

  if (total === 0) return quietLine[period];
  if (commits >= grindThreshold[period]) {
    return `${plural(commits, "commit")}. Touch grass, maybe?`;
  }
  if (reviews > commits) return "More reviews than commits. Professional opinion haver.";
  if (commits > 0 && prs === 0) {
    return `${plural(commits, "commit")}, 0 PRs. Shipping straight to main, bold.`;
  }
  if (merged > 0) return `${merged} merged. Somebody's actually shipping.`;
  return `${plural(total, "event")}. Respectable. Not iconic yet.`;
}

/** Breakdown by type, top repos, and a roast for one rolling window. */
export function summarizePeriod<T extends WindowEvent>(
  period: (typeof periods)[number],
  events: T[],
  now = Date.now(),
) {
  const since = now - period.days * 86_400_000;
  const inWindow = events.filter((event) => event.occurredAt.getTime() >= since);

  const typeCounts = new Map<ActivityType, number>();
  const repoCounts = new Map<string, number>();
  for (const event of inWindow) {
    typeCounts.set(event.type, (typeCounts.get(event.type) ?? 0) + 1);
    repoCounts.set(event.project, (repoCounts.get(event.project) ?? 0) + 1);
  }
  const count = (type: ActivityType) => typeCounts.get(type) ?? 0;

  return {
    events: inWindow,
    total: inWindow.length,
    byType: activityType.enumValues.map((type) => ({
      label: typeLabels[type],
      count: count(type),
    })),
    repos: [...repoCounts]
      .map(([name, repoCount]) => ({ label: name, count: repoCount }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_REPOS),
    roast: roastFor(period.key, count, inWindow.length),
  };
}
