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
    line: "3 commits. 10x dev cosplay.",
  },
  {
    period: "This week",
    line: `${weekTotals[weekTotals.length - 1]} events, down from ${weekTotals[peakWeek]}. Noted.`,
  },
  {
    period: "This year",
    line: `${totalEvents} events, zero shipped side projects.`,
  },
];

/** Recap as a vertical timeline; the latest period gets the filled node. */
export function Recap() {
  return (
    <ol className="relative flex flex-col gap-4">
      <span className="absolute top-2 bottom-2 left-[7px] w-px bg-brand-700" />
      {recaps.map((recap, index) => (
        <li key={recap.period} className="relative pl-7">
          <span
            className={`absolute top-0.5 left-0 h-[15px] w-[15px] rounded-full border-2 ${
              index === recaps.length - 1
                ? "border-brand-50 bg-brand-50"
                : "border-brand-600 bg-brand-950"
            }`}
          />
          <p className="text-sm font-medium text-brand-50">{recap.period}</p>
          <p className="mt-0.5 text-sm text-brand-300">{recap.line}</p>
        </li>
      ))}
    </ol>
  );
}
