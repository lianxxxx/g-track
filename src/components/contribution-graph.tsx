import { FiChevronDown, FiTrendingUp } from "react-icons/fi";

const WEEKS = 48;
const DAYS = 7;

/* Fixed window (ends on a Saturday so row 0 is Sunday) keeps SSR and client identical. */
const WINDOW_END = Date.UTC(2026, 7, 29);
const WINDOW_START = WINDOW_END - (WEEKS * DAYS - 1) * 86_400_000;

/** Deterministic PRNG so the server and client render identical cells. */
function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260825);

const levels: number[] = Array.from({ length: WEEKS * DAYS }, () => {
  const r = rand();
  if (r < 0.28) return 0;
  if (r < 0.55) return 1;
  if (r < 0.76) return 2;
  if (r < 0.92) return 3;
  return 4;
});

const total = levels.reduce((sum, level) => sum + level, 0) * 2;

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

const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

/* Sequential green ramp, low -> high (monotonic lightness in both themes). */
export const cellColor = [
  "bg-heat-0",
  "bg-heat-1",
  "bg-heat-2",
  "bg-accent-primary",
  "bg-accent-primary-hover",
];

const columns = "grid-cols-[repeat(48,minmax(0,1fr))]";
const cellGap = "gap-[2px] sm:gap-[3px]";

/** Decorative dashboard preview: a contribution heatmap fading out at the bottom. */
export function ContributionGraph() {
  return (
    <div
      aria-hidden
      className="w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
    >
      <div className="rounded-card border border-glass-border bg-glass p-5 backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <p className="text-left">
              <span className="font-heading text-xl font-semibold tracking-tight text-brand-50 tabular-nums">
                {total.toLocaleString("en-US")}
              </span>{" "}
              <span className="text-xs text-brand-400">
                contributions · last year
              </span>
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-primary-soft px-2 py-0.5 text-xs font-medium text-accent-primary tabular-nums">
              <FiTrendingUp className="h-3 w-3" strokeWidth={2} aria-hidden />
              18%
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1 sm:flex">
              <span className="text-[10px] text-brand-500">Less</span>
              {cellColor.map((color) => (
                <span
                  key={color}
                  className={`h-2 w-2 rounded-[2px] ${color}`}
                />
              ))}
              <span className="text-[10px] text-brand-500">More</span>
            </div>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-glass-border bg-glass px-2.5 text-xs text-brand-200">
              Last 12 months
              <FiChevronDown
                className="h-3.5 w-3.5 text-brand-400"
                strokeWidth={1.75}
                aria-hidden
              />
            </span>
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

          <div className={`col-start-2 grid grid-flow-col grid-rows-7 ${columns} ${cellGap}`}>
            {levels.map((level, index) => (
              <span
                key={index}
                className={`aspect-square rounded-[2px] ${cellColor[level]}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
