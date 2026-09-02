import { cellColor } from "@/components/contribution-graph";

const WEEKS = 52;
const DAYS = 7;
const DAY_MS = 86_400_000;

type Props = {
  /** Per-day totals, `{ day: "2026-09-02", count: 4 }`. Missing days are zero. */
  days: { day: string; count: number }[];
};

/** Counts to colour steps. Tuned for one developer, not a whole org. */
function levelOf(count: number) {
  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
const columns = "grid-cols-[repeat(52,minmax(0,1fr))]";
const cellGap = "gap-[2px] sm:gap-[3px]";

/** The user's real activity over the last year, one cell per day. */
export function ActivityHeatmap({ days }: Props) {
  const counts = new Map(days.map((entry) => [entry.day, entry.count]));

  const now = new Date();
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  // Grid rows are weekdays, so the window ends on the current week's Saturday.
  const end = today + (6 - new Date(today).getUTCDay()) * DAY_MS;
  const start = end - (WEEKS * DAYS - 1) * DAY_MS;

  const cells = Array.from({ length: WEEKS * DAYS }, (_, index) => {
    const date = start + index * DAY_MS;
    const day = new Date(date).toISOString().slice(0, 10);
    const count = counts.get(day) ?? 0;

    return { date, day, count, future: date > today };
  });

  const total = cells.reduce((sum, cell) => sum + cell.count, 0);

  /* One label per month boundary, skipping a first one that would collide. */
  const monthLabels = Array.from({ length: WEEKS }, (_, week) => {
    const date = new Date(start + week * DAYS * DAY_MS);
    return { week, month: date.getUTCMonth(), label: monthFormat.format(date) };
  })
    .filter(
      (entry, index, all) => index === 0 || entry.month !== all[index - 1].month,
    )
    .filter((entry, index, all) => index > 0 || all[1].week - entry.week >= 3);

  return (
    <section className="rounded-card border border-glass-border bg-glass p-6 backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 className="text-lg font-semibold text-brand-50">
          {total.toLocaleString("en-US")}{" "}
          <span className="text-sm font-normal text-brand-400">
            {total === 1 ? "event" : "events"} in the last year
          </span>
        </h2>

        <div className="flex items-center gap-1">
          <span className="text-[10px] text-brand-500">Less</span>
          {cellColor.map((color) => (
            <span key={color} className={`h-2 w-2 rounded-[2px] ${color}`} />
          ))}
          <span className="text-[10px] text-brand-500">More</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-2">
        <span />
        <div
          className={`mb-2 grid ${columns} text-[10px] leading-none text-brand-500`}
        >
          {monthLabels.map((entry) => (
            <span
              key={entry.week}
              className="whitespace-nowrap"
              style={{ gridColumn: `${entry.week + 1} / span 3` }}
            >
              {entry.label}
            </span>
          ))}
        </div>

        <div
          className={`hidden grid-rows-7 ${cellGap} text-[10px] leading-none text-brand-500 sm:grid`}
        >
          {weekdayLabels.map((label, index) => (
            <span key={index} className="flex items-center justify-end pr-1">
              {label}
            </span>
          ))}
        </div>

        <div
          className={`col-start-2 grid grid-flow-col grid-rows-7 ${columns} ${cellGap}`}
        >
          {cells.map((cell) => (
            <span
              key={cell.day}
              title={
                cell.future
                  ? undefined
                  : `${cell.count} ${cell.count === 1 ? "event" : "events"} on ${dayFormat.format(cell.date)}`
              }
              className={`aspect-square rounded-[2px] ${cellColor[levelOf(cell.count)]} ${cell.future ? "opacity-40" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
