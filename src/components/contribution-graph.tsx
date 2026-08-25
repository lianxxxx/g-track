const WEEKS = 48;
const DAYS = 7;

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

/* Sequential green ramp, dim -> bright on the dark surface (monotonic lightness). */
export const cellColor = [
  "bg-glass",
  "bg-[#0b3d22]",
  "bg-[#0a6b33]",
  "bg-accent-primary",
  "bg-accent-primary-hover",
];

/** Decorative dashboard preview: a contribution heatmap fading out at the bottom. */
export function ContributionGraph() {
  return (
    <div
      aria-hidden
      className="w-full [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"
    >
      <div className="rounded-card border border-glass-border bg-glass p-6 backdrop-blur-xl">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-left">
            <span className="font-heading text-xl font-semibold text-brand-50">
              {total.toLocaleString("en-US")}
            </span>{" "}
            <span className="text-xs text-brand-400">
              contributions · last year
            </span>
          </p>
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
        </div>
        <div className="mt-5 grid w-fit max-w-full grid-flow-col grid-rows-7 gap-[3px] overflow-hidden">
          {levels.map((level, index) => (
            <span
              key={index}
              className={`h-2.5 w-2.5 rounded-[3px] ${cellColor[level]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
