"use client";

import { useSyncExternalStore } from "react";
import { FiClock } from "react-icons/fi";

import { CardHeading } from "@/components/card-heading";
import { InkCurve } from "@/components/stat-charts";

const noSubscribe = () => () => {};

/** False during SSR and hydration, true after: hours need the viewer's timezone, which only the browser knows. */
function useIsClient() {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
}

const shifts = [
  { name: "Night owl", range: "after 9pm", hours: [21, 22, 23, 0, 1, 2, 3, 4] },
  { name: "Early bird", range: "before noon", hours: [5, 6, 7, 8, 9, 10, 11] },
  { name: "Office hours", range: "between noon and 6pm", hours: [12, 13, 14, 15, 16, 17] },
  { name: "Evening shift", range: "between 6 and 9pm", hours: [18, 19, 20] },
];

const hourLabel = new Intl.DateTimeFormat("en", { hour: "numeric" });

/** "Night owl: 68% of commits after 9pm." The peak hour is labeled on the chart itself. */
function quipFor(byHour: number[], total: number) {
  if (total === 0) return "No commits yet to judge you by.";

  const shiftTotals = shifts.map((shift) => ({
    ...shift,
    count: shift.hours.reduce((sum, hour) => sum + byHour[hour], 0),
  }));
  const top = shiftTotals.reduce((best, shift) => (shift.count > best.count ? shift : best));

  return `${top.name}: ${Math.round((top.count / total) * 100)}% of commits ${top.range}.`;
}

const axisLabels = ["12am", "6am", "12pm", "6pm"];

/* InkCurve's default drawing: 150 units wide inside a viewBox padded 6 on each side. */
const CURVE_WIDTH = 150;
const CURVE_PAD = 6;

/** Commits per hour of the day, in the viewer's timezone. `commitTimes` are ISO timestamps. */
export function CodingHours({ commitTimes }: { commitTimes: string[] }) {
  const isClient = useIsClient();

  const byHour = Array.from({ length: 24 }, () => 0);
  if (isClient) {
    for (const time of commitTimes) byHour[new Date(time).getHours()]++;
  }
  const peak = Math.max(...byHour);
  const peakHour = peak > 0 ? byHour.indexOf(peak) : -1;
  const peakLeft = ((CURVE_PAD + (peakHour / 23) * CURVE_WIDTH) / (CURVE_WIDTH + CURVE_PAD * 2)) * 100;

  return (
    // No card border: the heading and the line sit straight on the page, so the board isn't all boxes.
    <section aria-labelledby="coding-hours-heading" className="pt-6">
      <CardHeading id="coding-hours-heading" icon={FiClock} title="Coding hours" meta="Last 90 days" />
      <p className="mt-5 min-h-7 text-pretty text-lg leading-7 text-brand-50">
        {isClient ? quipFor(byHour, commitTimes.length) : null}
      </p>

      {/* One ink line across the day, with the peak hour named over its dot. */}
      <div aria-hidden className="mt-6 text-brand-50">
        <div className="relative h-5">
          {peakHour >= 0 && (
            <span
              className="absolute -translate-x-1/2 whitespace-nowrap text-[10px] font-medium sm:text-xs"
              style={{ left: `${peakLeft}%` }}
            >
              {hourLabel.format(new Date(2000, 0, 1, peakHour))}
            </span>
          )}
        </div>
        <InkCurve values={byHour} className="h-28" />
        <div className="mt-2 grid grid-cols-4 text-[10px] text-brand-400 sm:text-xs">
          {axisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
