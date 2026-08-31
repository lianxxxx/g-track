import { FiChevronDown } from "react-icons/fi";

const eventTypes = [
  {
    key: "commits",
    label: "Commits",
    color: "bg-event-commit",
    stroke: "stroke-event-commit",
  },
  {
    key: "prs",
    label: "Pull requests",
    color: "bg-event-pr",
    stroke: "stroke-event-pr",
  },
  {
    key: "reviews",
    label: "Reviews",
    color: "bg-event-review",
    stroke: "stroke-event-review",
  },
  {
    key: "branches",
    label: "Branches",
    color: "bg-event-branch",
    stroke: "stroke-event-branch",
  },
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
const monthLabels = ["Jun", "Jul", "Aug"];

/* Donut ring: r = 100 / 2π, so one dasharray unit is one percent of the circle. */
const RING_RADIUS = 15.9155;
const RING_GAP = 1.5;

let ringOffset = 25; // start at 12 o'clock
const mixSegments = eventTypes.map((type) => {
  const count = weeks.reduce((sum, week) => sum + week[type.key], 0);
  const pct = (count / totalEvents) * 100;
  const arc = Math.max(pct - RING_GAP, 0);
  const segment = {
    ...type,
    pct,
    dash: `${arc} ${100 - arc}`,
    offset: ringOffset,
  };
  ringOffset -= pct;
  return segment;
});

export function InsightsView() {
  return (
    <div className="grid gap-8 sm:grid-cols-5">
      <div className="sm:col-span-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-50">Events per week</p>
            <p className="mt-0.5 text-xs text-brand-400 tabular-nums">
              {totalEvents} events · avg {Math.round(totalEvents / weeks.length)}{" "}
              a week
            </p>
          </div>
          <span
            aria-hidden
            className="hidden h-7 shrink-0 items-center gap-1.5 rounded-full border border-glass-border bg-glass px-2.5 text-xs text-brand-200 sm:inline-flex"
          >
            Last 12 weeks
            <FiChevronDown
              className="h-3.5 w-3.5 text-brand-400"
              strokeWidth={1.75}
              aria-hidden
            />
          </span>
        </div>

        <div aria-hidden className="relative mt-12 h-36 sm:h-40">
          <div className="absolute inset-0 flex flex-col justify-between">
            <span className="border-t border-dashed border-glass-border" />
            <span className="border-t border-dashed border-glass-border" />
            <span className="border-t border-dashed border-glass-border" />
            <span className="border-t border-glass-border" />
          </div>

          <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2">
            {weekTotals.map((total, index) => {
              const peak = index === peakWeek;
              return (
                <div
                  key={index}
                  className="relative flex h-full flex-1 items-end justify-center"
                >
                  {peak && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-glass-border bg-brand-900 px-2 py-1 text-[11px] font-medium text-brand-50 shadow-sm tabular-nums light:bg-white">
                      {total} events
                    </span>
                  )}
                  <span
                    style={{ height: `${(total / weekTotals[peakWeek]) * 100}%` }}
                    className={`w-2.5 rounded-t-full sm:w-3.5 ${
                      peak ? "bg-accent-primary" : "bg-accent-primary/30"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div
          aria-hidden
          className="mt-2 grid grid-cols-3 text-[10px] text-brand-500"
        >
          {monthLabels.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>

      <div className="sm:col-span-2">
        <p className="text-sm font-medium text-brand-50">Event mix</p>
        <div className="mt-5 flex items-center gap-5">
          <div aria-hidden className="relative h-28 w-28 shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full">
              <circle
                cx="18"
                cy="18"
                r={RING_RADIUS}
                fill="none"
                strokeWidth="3.5"
                className="stroke-glass-border"
              />
              {mixSegments.map((segment) => (
                <circle
                  key={segment.key}
                  cx="18"
                  cy="18"
                  r={RING_RADIUS}
                  fill="none"
                  strokeWidth="3.5"
                  strokeDasharray={segment.dash}
                  strokeDashoffset={segment.offset}
                  className={segment.stroke}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-xl font-semibold tracking-tight text-brand-50 tabular-nums">
                {totalEvents}
              </span>
              <span className="text-[10px] text-brand-400">events</span>
            </div>
          </div>

          <ul className="flex flex-1 flex-col gap-2">
            {mixSegments.map((segment) => (
              <li
                key={segment.key}
                className="flex items-center gap-2 text-sm text-brand-300"
              >
                <span
                  aria-hidden
                  className={`h-2 w-2 rounded-full ${segment.color}`}
                />
                {segment.label}
                <span className="ml-auto text-xs text-brand-400 tabular-nums">
                  {Math.round(segment.pct)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
