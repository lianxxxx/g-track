import type { ReactNode } from "react";

import { Recap } from "@/components/preview/insights-view";
import { ContributionStrip, StreakTicks, WeekdayBars } from "@/components/stat-charts";

/* Last 14 days, oldest first. Hand-picked so it reads as a real fortnight. */
const recentLevels = [0, 2, 1, 0, 3, 1, 2, 1, 0, 4, 2, 0, 1, 3];

/* Relative commit volume per weekday, Monday first; Thursday is the peak. */
const weekdayTotals = [45, 60, 50, 100, 70, 20, 15];

const stats: { label: string; value: string; unit?: string; chart: ReactNode }[] = [
  { label: "Contributions", value: "1,024", chart: <ContributionStrip levels={recentLevels} /> },
  { label: "Current streak", value: "21", unit: "days", chart: <StreakTicks streak={21} goal={30} /> },
  { label: "Busiest day", value: "Thu", chart: <WeekdayBars totals={weekdayTotals} /> },
];

const card = "rounded-card border border-glass-border bg-brand-950";

function Pane({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${card} p-5 sm:p-6 ${className}`}>
      <p className="text-sm font-medium text-brand-50">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** Board preview: small cards packed tight, same card language as the hero graph. */
export function PreviewSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-28 px-6 py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <h2
            id="features-heading"
            className="max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Your activity, but with the <span className="italic">details</span>
          </h2>
          <p className="mt-4 max-w-md text-pretty text-lg leading-8 text-brand-300">
            GitHub shows you squares. We show you the whole story, in one
            place.
          </p>
        </div>

        <div aria-hidden className="mt-12 grid gap-3 text-left md:grid-cols-12">
          <dl className="grid gap-3 md:col-span-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`${card} flex items-center justify-between gap-2 px-5 py-4 sm:flex-col sm:items-stretch sm:gap-1 sm:px-6 sm:py-4`}
              >
                <dt className="text-sm text-brand-300 sm:text-xs sm:text-brand-400">{stat.label}</dt>
                <dd className="flex items-end justify-between gap-4">
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-heading text-2xl font-semibold tracking-tight text-brand-50 tabular-nums sm:text-3xl">
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-xs text-brand-400">{stat.unit}</span>
                    )}
                  </span>
                  <span className="hidden sm:block">{stat.chart}</span>
                </dd>
              </div>
            ))}
          </dl>

          <Pane title="The recap" className="md:col-span-7">
            <Recap />
          </Pane>
        </div>
      </div>
    </section>
  );
}
