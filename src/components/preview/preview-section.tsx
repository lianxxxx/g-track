import {
  FiActivity,
  FiArrowUpRight,
  FiCalendar,
  FiGitBranch,
  FiGitCommit,
  FiMoreVertical,
  FiTrendingUp,
} from "react-icons/fi";

import { Recap } from "@/components/preview/insights-view";
import { InkCurve, inkHatch } from "@/components/stat-charts";

/* Relative commit volume per weekday, Monday first; Thursday is the peak. */
const weekdayTotals = [45, 60, 50, 100, 70, 20, 15];

const STREAK = 21;
const STREAK_GOAL = 30;

/* This week against the weekly goal and your usual week, drawn as a single-line half gauge. */
const WEEK_EVENTS = 64;
const WEEK_GOAL = 100;
const WEEK_AVG = 56;
/* Gauge arc radius, centered at (100, 100) in the SVG. */
const RADIUS = 90;

/** Point on the gauge at `radius`, `t` of the way from the left end (0) to the right end (1). */
function point(radius: number, t: number) {
  const angle = Math.PI - t * Math.PI;
  return {
    x: (100 + Math.cos(angle) * radius).toFixed(2),
    y: (100 - Math.sin(angle) * radius).toFixed(2),
  };
}

/* No fill: cards are just a hairline on the textured page, same as the icon tiles. */
const card = "rounded-card border border-glass-border";
/* Same icon tile as How it works: small rounded square, hairline border, muted icon. */
const iconTile =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-glass-border text-brand-300";

/* Bare trend arrow: same icon rules as the tiles, without the square. */
function ArrowChip() {
  return <FiArrowUpRight className="h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.75} />;
}

function ContributionsCard() {
  return (
    <div className={`${card} flex flex-col gap-8 p-5 sm:flex-row sm:justify-between sm:p-6`}>
      <div className="flex flex-col justify-between gap-8">
        <div className="flex items-center gap-4">
          <span className={iconTile}>
            <FiActivity className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <p className="font-heading text-lg font-medium text-brand-50">Contributions</p>
            <p className="text-xs text-brand-400">Synced 2 min ago</p>
          </div>
        </div>
        <div>
          <p className="flex items-center gap-2 text-sm text-brand-300">
            This month <ArrowChip />
          </p>
          <p className="mt-1 font-heading text-5xl font-semibold tracking-tight text-brand-50 tabular-nums">
            1,024
          </p>
        </div>
      </div>
      <div className="sm:w-56">
        <BusiestDayTile />
      </div>
    </div>
  );
}

function WeekCard() {
  const progress = WEEK_EVENTS / WEEK_GOAL;
  return (
    <div className={`${card} flex flex-col justify-between gap-8 p-5 sm:p-6`}>
      <div className="flex items-center gap-4">
        <span className={iconTile}>
          <FiCalendar className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <p className="font-heading text-lg font-medium text-brand-50">This week</p>
      </div>

      <div className="flex flex-col gap-6 text-brand-50 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col justify-end self-stretch">
          <div>
            <p className="flex items-center gap-2 font-heading text-2xl font-semibold tabular-nums">
              +14%
              <ArrowChip />
            </p>
            <p className="mt-1 text-xs font-medium opacity-75">Avg: {WEEK_AVG} events a week</p>
          </div>
        </div>

        <div className="relative mx-auto w-52 sm:mx-0">
          {/* One ink line, with a hollow dot where progress stops (same marks as the Thursday chart). */}
          <svg viewBox="0 0 200 112" className="w-full overflow-visible">
            <path
              d={`M ${100 - RADIUS} 100 A ${RADIUS} ${RADIUS} 0 0 1 ${100 + RADIUS} 100`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx={point(RADIUS, progress).x}
              cy={point(RADIUS, progress).y}
              r={5}
              className="fill-page"
              stroke="currentColor"
              strokeWidth={2}
            />
          </svg>
          <p className="absolute inset-x-0 bottom-0 text-center">
            <span className="font-heading text-3xl font-semibold tabular-nums">{WEEK_EVENTS}</span>
            <span className="ml-1 text-xs font-medium opacity-75">events</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function LatestPushCard() {
  return (
    <div className={`${card} flex flex-col justify-between gap-5 p-5 sm:p-6`}>
      <div className="flex items-center gap-4">
        <span className={iconTile}>
          <FiGitCommit className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-lg font-medium text-brand-50">Latest push</p>
          <p className="text-xs text-brand-400">your-app · main</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-glass-border px-4 py-3 text-sm text-brand-200">
        <FiGitBranch className="h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.75} />
        <span className="min-w-0 flex-1 truncate font-mono text-xs">feat: add a closing CTA</span>
        <FiMoreVertical className="h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function StreakTile() {
  const filled = (STREAK / STREAK_GOAL) * 100;
  return (
    <div className="flex flex-col gap-6 rounded-2xl p-4 text-brand-50">
      <p className="text-sm font-medium opacity-75">Current streak</p>
      <p className="font-heading text-3xl font-semibold tabular-nums">
        {STREAK} <span className="text-base font-medium">days</span>
      </p>
      <div>
        <p className="text-xs font-semibold tabular-nums">
          {STREAK} of {STREAK_GOAL}
        </p>
        <div className="relative mt-2 h-6 rounded-lg border border-brand-50">
          <span
            className={`absolute inset-y-0 left-0 rounded-l-lg border-r border-brand-50 ${inkHatch}`}
            style={{ width: `${filled}%` }}
          />
          <span
            className="absolute -top-2.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-brand-950 bg-brand-50"
            style={{ left: `${filled}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function BusiestDayTile() {
  return (
    <div className="flex flex-col gap-4 px-1 pt-2 text-brand-50">
      <p className="text-sm font-medium opacity-75">Busiest day</p>
      <p className="font-heading text-xl font-semibold">Thursday</p>
      {/* Ink curve with a dot on the peak and an arrow where the week trails off. */}
      <InkCurve values={weekdayTotals} arrow />
    </div>
  );
}

function RecapCard() {
  return (
    <div className={`${card} grid gap-6 p-5 sm:grid-cols-2 sm:p-6`}>
      <div>
        <div className="mb-6 flex items-center gap-4">
          <span className={iconTile}>
            <FiTrendingUp className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <p className="font-heading text-lg leading-tight font-medium text-brand-50">The recap</p>
        </div>
        <Recap />
      </div>
      <div>
        <StreakTile />
      </div>
    </div>
  );
}

/** Board preview as a bento: mono brand cards, with green kept to the one hero tile. */
export function PreviewSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-28 px-6 py-24 sm:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
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

        <div aria-hidden className="mt-12 grid gap-3 text-left lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <ContributionsCard />
            <WeekCard />
          </div>
          <div className="flex flex-col gap-3">
            <LatestPushCard />
            <RecapCard />
          </div>
        </div>
      </div>
    </section>
  );
}
