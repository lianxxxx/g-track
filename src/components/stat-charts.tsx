import { squareColor } from "@/components/contribution-graph";

/** Two rows of a week: the last 14 days as heatmap squares. `levels` are 0-4, oldest first. */
export function ContributionStrip({ levels }: { levels: number[] }) {
  return (
    <span className="grid grid-flow-col grid-rows-2 gap-[2px]">
      {levels.map((level, index) => (
        <span key={index} className={`h-2 w-2 rounded-[2px] ${squareColor[level]}`} />
      ))}
    </span>
  );
}

/** One tick per day toward a goal; ticks up to `streak` are filled. */
export function StreakTicks({ streak, goal }: { streak: number; goal: number }) {
  return (
    <span className="flex items-end gap-[2px]">
      {Array.from({ length: goal }, (_, index) => (
        <span
          key={index}
          className={`h-4 w-[2px] rounded-full ${index < streak ? "bg-brand-50" : "bg-brand-800"}`}
        />
      ))}
    </span>
  );
}

const weekdayInitials = ["M", "T", "W", "T", "F", "S", "S"];

/** Seven bars, Monday first, scaled to the busiest day, which is drawn in black. */
export function WeekdayBars({ totals }: { totals: number[] }) {
  const peak = Math.max(...totals);

  return (
    <span className="flex items-end gap-1">
      {totals.map((total, index) => {
        const isPeak = peak > 0 && total === peak;
        return (
          <span key={index} className="flex flex-col items-center gap-1">
            <span className="flex h-6 w-1.5 items-end">
              <span
                style={{ height: `${peak > 0 ? Math.max((total / peak) * 100, 8) : 8}%` }}
                className={`w-full rounded-full ${isPeak ? "bg-brand-50" : "bg-brand-700"}`}
              />
            </span>
            <span
              className={`text-[9px] leading-none ${isPeak ? "text-brand-50" : "text-brand-400"}`}
            >
              {weekdayInitials[index]}
            </span>
          </span>
        );
      })}
    </span>
  );
}
