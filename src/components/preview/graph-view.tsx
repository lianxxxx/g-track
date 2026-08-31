import { FiChevronDown, FiTrendingUp } from "react-icons/fi";

import { cellColor, mulberry32 } from "@/components/contribution-graph";

const WEEKS = 36;
const DAYS = 7;

const rand = mulberry32(20260831);

const levels: number[] = Array.from({ length: WEEKS * DAYS }, () => {
  const r = rand();
  if (r < 0.26) return 0;
  if (r < 0.52) return 1;
  if (r < 0.74) return 2;
  if (r < 0.91) return 3;
  return 4;
});

const today = levels.length - 1;

const contributions = levels.reduce((sum, level) => sum + level, 0) * 2;

/* Nine months ending in August: one label per four-week block. */
const graphMonths = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

const graphStats = [
  {
    label: "Contributions",
    value: contributions.toLocaleString("en-US"),
    trend: "18%",
  },
  { label: "Current streak", value: "21", unit: "days" },
  { label: "Busiest day", value: "Thu" },
];

export function GraphView() {
  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <dl className="grid grid-cols-3 divide-x divide-glass-border">
          {graphStats.map((stat) => (
            <div
              key={stat.label}
              className="px-3 first:pl-0 last:pr-0 sm:px-6"
            >
              <dt className="text-xs text-brand-400">{stat.label}</dt>
              <dd className="mt-1 flex items-baseline gap-1.5">
                <span className="font-heading text-2xl font-semibold tracking-tight text-brand-50 tabular-nums">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-xs text-brand-400">{stat.unit}</span>
                )}
                {stat.trend && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-primary-soft px-1.5 py-0.5 text-[11px] font-medium text-accent-primary tabular-nums">
                    <FiTrendingUp
                      className="h-3 w-3"
                      strokeWidth={2}
                      aria-hidden
                    />
                    {stat.trend}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <span
          aria-hidden
          className="hidden h-7 shrink-0 items-center gap-1.5 rounded-full border border-glass-border bg-glass px-2.5 text-xs text-brand-200 sm:inline-flex"
        >
          Last 9 months
          <FiChevronDown
            className="h-3.5 w-3.5 text-brand-400"
            strokeWidth={1.75}
            aria-hidden
          />
        </span>
      </div>

      <div aria-hidden className="mt-6 grid grid-cols-[auto_1fr] gap-x-2">
        <span />
        <div className="mb-2 grid grid-cols-9 text-[10px] leading-none text-brand-500">
          {graphMonths.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>

        <div className="hidden grid-rows-7 gap-[3px] text-[10px] leading-none text-brand-500 sm:grid">
          {weekdayLabels.map((label, index) => (
            <span key={index} className="flex items-center justify-end pr-1">
              {label}
            </span>
          ))}
        </div>

        <div className="col-start-2 grid grid-flow-col grid-cols-[repeat(36,minmax(0,1fr))] grid-rows-7 gap-[2px] sm:gap-[3px]">
          {levels.map((level, index) => (
            <span
              key={index}
              className={`aspect-square rounded-[2px] sm:rounded-[4px] ${cellColor[level]} ${
                index === today
                  ? "ring-1 ring-brand-50 ring-offset-1 ring-offset-brand-950"
                  : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div aria-hidden className="mt-4 flex items-center justify-end gap-1">
        <span className="text-[10px] text-brand-500">Less</span>
        {cellColor.map((color) => (
          <span key={color} className={`h-2 w-2 rounded-[2px] ${color}`} />
        ))}
        <span className="text-[10px] text-brand-500">More</span>
      </div>
    </div>
  );
}
