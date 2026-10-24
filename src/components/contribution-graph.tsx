import { inkCell } from "@/components/stat-charts";

const WEEKS = 48;
const DAYS = 7;

/* Fixed window (ends on a Saturday so row 0 is Sunday) keeps SSR and client identical. */
const WINDOW_END = Date.UTC(2026, 7, 29);
const WINDOW_START = WINDOW_END - (WEEKS * DAYS - 1) * 86_400_000;

/** Deterministic PRNG so the server and client render identical cells. */
export function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

/* One label per month boundary; drop a leading label that would collide with the next. */
const monthLabels = Array.from({ length: WEEKS }, (_, week) => {
  const date = new Date(WINDOW_START + week * DAYS * 86_400_000);
  return { week, month: date.getUTCMonth(), label: monthFormat.format(date) };
})
  .filter((entry, index, all) => index === 0 || entry.month !== all[index - 1].month)
  .filter((entry, index, all) => index > 0 || all[1].week - entry.week >= 3);

const DAY_MS = 86_400_000;

/** Grid index of a UTC date inside the window (column-major: week, then weekday). */
function dayIndex(year: number, month: number, day: number) {
  return Math.round((Date.UTC(year, month, day) - WINDOW_START) / DAY_MS);
}

/* The data tells a story: steady autumn, a dead December, a March crunch, a strong finish. */
function density(week: number) {
  if (week < 10) return 0.4;
  if (week < 18) return 0.3;
  if (week < 28) return 0.65;
  if (week < 38) return 0.4;
  return 0.75;
}

const breakStart = dayIndex(2025, 11, 8);
const breakEnd = dayIndex(2026, 0, 3);
const crunchDay = dayIndex(2026, 2, 14);
const today = WEEKS * DAYS - 1;

const rand = mulberry32(20260825);

const levels: number[] = Array.from({ length: WEEKS * DAYS }, (_, index) => {
  const active = rand() < density(Math.floor(index / DAYS));
  const r = rand();
  if (index >= breakStart && index <= breakEnd) return 0;
  if (index === crunchDay || index === today) return 4;
  if (!active) return 0;
  if (r < 0.45) return 1;
  if (r < 0.75) return 2;
  if (r < 0.93) return 3;
  return 4;
});

/* Phones show only the latest half of the year so each cell is big enough (~11px)
   for the outlines and hatching; at 48 weeks they shrink to ~6px and read as rings. */
const MOBILE_WEEKS = 24;
const mobileStart = WEEKS - MOBILE_WEEKS;
const mobileMonthLabels = monthLabels
  .filter((entry) => entry.week >= mobileStart)
  .map((entry) => ({ ...entry, week: entry.week - mobileStart }));

const columns = "grid-cols-[repeat(24,minmax(0,1fr))] sm:grid-cols-[repeat(48,minmax(0,1fr))]";
const cellGap = "gap-[3px] sm:gap-1";
const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

/** Decorative hero graph: a year of activity with a shape to it. */
export function ContributionGraph() {
  return (
    <div aria-hidden className="w-full text-left">
      <div className="grid grid-cols-[auto_1fr] gap-x-2">
        <span />
        {/* Month labels per breakpoint, since grid placement is inline and can't be responsive. */}
        {[
          { labels: mobileMonthLabels, className: "grid sm:hidden" },
          { labels: monthLabels, className: "hidden sm:grid" },
        ].map((row) => (
          <div
            key={row.className}
            className={`mb-2 ${row.className} ${columns} text-[10px] leading-none text-brand-400 sm:text-xs`}
          >
            {row.labels.map((entry) => (
              <span
                key={entry.week}
                className="whitespace-nowrap"
                style={{ gridColumn: `${entry.week + 1} / span 3` }}
              >
                {entry.label}
              </span>
            ))}
          </div>
        ))}

        <div className={`hidden grid-rows-7 ${cellGap} text-xs leading-none text-brand-400 sm:grid`}>
          {weekdayLabels.map((label, index) => (
            <span key={index} className="flex items-center justify-end pr-1">
              {label}
            </span>
          ))}
        </div>

        <div className={`col-start-2 grid grid-flow-col grid-rows-7 ${columns} ${cellGap}`}>
          {levels.map((level, index) => (
            <span
              key={index}
              className={`aspect-square rounded-[3px] ${inkCell[level]} ${
                index < mobileStart * DAYS ? "hidden sm:block" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
