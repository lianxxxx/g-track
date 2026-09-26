import { FiAward, FiCalendar, FiSun } from "react-icons/fi";

/* Event types summed into each week's total. */
const eventTypes = [
  { key: "commits", label: "Commits" },
  { key: "prs", label: "Pull requests" },
  { key: "reviews", label: "Reviews" },
  { key: "branches", label: "Branches" },
] as const;

type EventKey = (typeof eventTypes)[number]["key"];

/* Twelve weeks of counts per event type, oldest first. */
const weeks: Record<EventKey, number>[] = [
  { commits: 14, prs: 4, reviews: 3, branches: 1 },
  { commits: 18, prs: 6, reviews: 4, branches: 2 },
  { commits: 9, prs: 3, reviews: 2, branches: 1 },
  { commits: 22, prs: 7, reviews: 5, branches: 2 },
  { commits: 15, prs: 5, reviews: 3, branches: 2 },
  { commits: 24, prs: 8, reviews: 6, branches: 2 },
  { commits: 12, prs: 4, reviews: 3, branches: 1 },
  { commits: 27, prs: 9, reviews: 6, branches: 3 },
  { commits: 18, prs: 6, reviews: 4, branches: 2 },
  { commits: 32, prs: 11, reviews: 8, branches: 3 },
  { commits: 22, prs: 7, reviews: 5, branches: 2 },
  { commits: 20, prs: 7, reviews: 4, branches: 2 },
];

const weekTotals = weeks.map((week) =>
  eventTypes.reduce((sum, type) => sum + week[type.key], 0),
);
const peakWeek = weekTotals.indexOf(Math.max(...weekTotals));
const totalEvents = weekTotals.reduce((sum, total) => sum + total, 0);

/* Board voice: a little roast per period. */
const recaps = [
  {
    period: "Today",
    icon: FiSun,
    line: "3 commits. You larped as a 10x dev and honestly? Convincing.",
  },
  {
    period: "This week",
    icon: FiCalendar,
    line: `${weekTotals[weekTotals.length - 1]} events, down from your ${weekTotals[peakWeek]} peak. We noticed.`,
  },
  {
    period: "This year",
    icon: FiAward,
    line: `${totalEvents} events and zero finished side projects. Iconic.`,
  },
];

export function Recap() {
  return (
    <div>
      <ul className="-mt-2 flex flex-col divide-y divide-glass-border">
        {recaps.map((recap) => (
          <li key={recap.period} className="flex gap-3 py-3 last:pb-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-glass-border text-brand-300">
              <recap.icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-brand-400">
                {recap.period}
              </p>
              <p className="mt-1 text-sm leading-6 text-brand-100">{recap.line}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
