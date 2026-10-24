/* Line-art pieces shared by the landing page and the dashboard: hairline outlines,
   diagonal hatching, and one ink line. No imports, so client components can use them too. */

export const inkHatch =
  "bg-[repeating-linear-gradient(135deg,var(--brand-50)_0_1.5px,transparent_1.5px_6px)]";

/* Contribution cells: hatching gets denser with activity, solid ink is reserved for the peak days. */
export const inkCell = [
  "border border-brand-800",
  "border border-brand-600",
  "border border-brand-400 bg-[repeating-linear-gradient(135deg,var(--brand-400)_0_1px,transparent_1px_5px)]",
  "border border-brand-50 bg-[repeating-linear-gradient(135deg,var(--brand-50)_0_1px,transparent_1px_3px)]",
  "bg-brand-50",
];

/** Two rows of a week: the last 14 days as contribution cells. `levels` are 0-4, oldest first. */
export function ContributionStrip({ levels }: { levels: number[] }) {
  return (
    <span className="grid grid-flow-col grid-rows-2 gap-[3px]">
      {levels.map((level, index) => (
        <span key={index} className={`h-2.5 w-2.5 rounded-[2px] ${inkCell[level]}`} />
      ))}
    </span>
  );
}

/** Outlined bar toward a goal, hatched up to `streak`, with a knob where it stops. */
export function StreakBar({ streak, goal }: { streak: number; goal: number }) {
  const filled = Math.min(streak / goal, 1) * 100;
  return (
    <span className="relative block h-4 w-28 rounded-md border border-brand-50">
      {filled > 0 && (
        <span
          className={`absolute inset-y-0 left-0 rounded-l-md border-r border-brand-50 ${inkHatch}`}
          style={{ width: `${filled}%` }}
        />
      )}
      <span
        className="absolute -top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-page bg-brand-50"
        style={{ left: `${filled}%` }}
      />
    </span>
  );
}

type CurveProps = {
  values: number[];
  /** Drawing size in SVG units. Without a height class the chart keeps this ratio. */
  width?: number;
  height?: number;
  /** Arrowhead at the end, where the series trails off. Best kept to the natural ratio, where it isn't stretched. */
  arrow?: boolean;
  /** Sizing for the wrapper, e.g. "h-28" to stretch the line across a wide card. */
  className?: string;
};

/** Smooth ink line through `values`, with a hollow dot on the peak. All zeros draw a flat line.
 *  The line stretches to the box at a constant 2px; the dot is HTML so stretching can't squash it. */
export function InkCurve({ values, width = 150, height = 60, arrow = false, className = "" }: CurveProps) {
  const max = Math.max(0, ...values);
  const points = values.map((value, index) => ({
    x: values.length > 1 ? (index / (values.length - 1)) * width : width / 2,
    y: height - 2 - (max > 0 ? (value / max) * (height - 14) : 0),
  }));
  const boxWidth = width + 12;
  const boxHeight = height + 4;

  /* Catmull-Rom turned into cubic Béziers. */
  const line = points.reduce((path, current, index) => {
    if (index === 0) return `M ${current.x.toFixed(2)} ${current.y.toFixed(2)}`;
    const p0 = points[index - 2] ?? points[index - 1];
    const p1 = points[index - 1];
    const p3 = points[index + 1] ?? current;
    const c1x = (p1.x + (current.x - p0.x) / 6).toFixed(2);
    const c1y = (p1.y + (current.y - p0.y) / 6).toFixed(2);
    const c2x = (current.x - (p3.x - p1.x) / 6).toFixed(2);
    const c2y = (current.y - (p3.y - p1.y) / 6).toFixed(2);
    return `${path} C ${c1x} ${c1y} ${c2x} ${c2y} ${current.x.toFixed(2)} ${current.y.toFixed(2)}`;
  }, "");

  /* Arrowhead follows the curve's final direction: two 7-unit wings, 28° either side of it. */
  const end = points[points.length - 1];
  const before = points[points.length - 2] ?? end;
  const heading = Math.atan2(end.y - before.y, end.x - before.x);
  const wing = (offset: number) =>
    `${(end.x - Math.cos(heading + offset) * 7).toFixed(2)} ${(end.y - Math.sin(heading + offset) * 7).toFixed(2)}`;
  const top = max > 0 ? points[values.indexOf(max)] : null;

  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: `${boxWidth} / ${boxHeight}` }}>
      <svg
        viewBox={`-6 0 ${boxWidth} ${boxHeight}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {arrow && points.length > 1 && (
          <path
            d={`M ${wing(0.5)} L ${end.x.toFixed(2)} ${end.y.toFixed(2)} L ${wing(-0.5)}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {top && (
        <span
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-current bg-page"
          style={{ left: `${((top.x + 6) / boxWidth) * 100}%`, top: `${(top.y / boxHeight) * 100}%` }}
        />
      )}
    </div>
  );
}
