import { inkCell } from "@/components/stat-charts";

const WEEKS = 52;
const DAYS = 7;
const DAY_MS = 86_400_000;

type Props = {
  /** Per-day totals, `{ day: "2026-09-02", count: 4 }`. Missing days are zero. */
  days: { day: string; count: number }[];
};

/** Counts to colour steps. Tuned for one developer, not a whole org. */
export function levelOf(count: number) {
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
    <div className="w-full">
      <div className="grid grid-cols-[auto_1fr] gap-x-2">
        <span />
        <div className={`mb-2 grid ${columns} text-[10px] leading-none text-brand-400 sm:text-xs`}>
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

        <div className={`hidden grid-rows-7 ${cellGap} text-xs leading-none text-brand-400 sm:grid`}>
          {weekdayLabels.map((label, index) => (
            <span key={index} className="flex items-center justify-end pr-1">
              {label}
            </span>
          ))}
        </div>

        <div className={`col-start-2 grid grid-flow-col grid-rows-7 ${columns} ${cellGap}`}>
          {cells.map((cell) => (
            <span
              key={cell.day}
              title={
                cell.future
                  ? undefined
                  : `${cell.count} ${cell.count === 1 ? "event" : "events"} on ${dayFormat.format(cell.date)}`
              }
              className={`aspect-square rounded-[2px] sm:rounded-[3px] ${cell.future ? "" : inkCell[levelOf(cell.count)]}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 hidden items-center justify-end gap-1.5 sm:flex">
        <span className="mr-1 text-xs text-brand-400">Less</span>
        {inkCell.map((color) => (
          <span key={color} className={`h-2.5 w-2.5 rounded-[3px] ${color}`} />
        ))}
        <span className="ml-1 text-xs text-brand-400">More</span>
      </div>
    </div>
  );
}
