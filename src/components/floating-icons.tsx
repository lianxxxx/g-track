import type { ReactNode } from "react";
import {
  FiEye,
  FiGitBranch,
  FiGitCommit,
  FiGitMerge,
  FiStar,
  FiZap,
} from "react-icons/fi";

/* Preview variants: 1 tinted glass tiles, 2 product fragments, 3 white tiles with colored icons. */
export type FloatingVariant = 1 | 2 | 3;

type Tone = "commit" | "pr" | "branch" | "star" | "review";

/* Full class strings so Tailwind can see them. */
const tones: Record<Tone, { tinted: string; text: string }> = {
  commit: {
    tinted: "border-event-commit/30 bg-event-commit/12 text-event-commit",
    text: "text-event-commit",
  },
  pr: {
    tinted: "border-event-pr/30 bg-event-pr/12 text-event-pr",
    text: "text-event-pr",
  },
  branch: {
    tinted: "border-event-branch/30 bg-event-branch/12 text-event-branch",
    text: "text-event-branch",
  },
  star: {
    tinted: "border-event-star/30 bg-event-star/12 text-event-star",
    text: "text-event-star",
  },
  review: {
    tinted: "border-event-review/30 bg-event-review/12 text-event-review",
    text: "text-event-review",
  },
};

type FloatingItem = {
  label: string;
  position: string;
  rotate: string;
  tone: Tone;
  icon: ReactNode;
  text: string;
  mono?: boolean;
};

const items: FloatingItem[] = [
  {
    label: "Branches",
    position: "left-[7%] top-[16%]",
    rotate: "-rotate-6",
    tone: "branch",
    icon: <FiGitBranch strokeWidth={1.75} aria-hidden />,
    text: "feat/heatmap",
    mono: true,
  },
  {
    label: "Commits",
    position: "left-[15%] top-[54%]",
    rotate: "rotate-3",
    tone: "commit",
    icon: <FiGitCommit strokeWidth={1.75} aria-hidden />,
    text: "+3 commits",
  },
  {
    label: "Stars",
    position: "bottom-[14%] left-[8%]",
    rotate: "-rotate-3",
    tone: "star",
    icon: <FiStar strokeWidth={1.75} aria-hidden />,
    text: "1.2k",
  },
  {
    label: "Pull requests",
    position: "right-[7%] top-[14%]",
    rotate: "rotate-6",
    tone: "pr",
    icon: <FiGitMerge strokeWidth={1.75} aria-hidden />,
    text: "Merged",
  },
  {
    label: "Reviews",
    position: "right-[14%] top-[52%]",
    rotate: "-rotate-3",
    tone: "review",
    icon: <FiEye strokeWidth={1.75} aria-hidden />,
    text: "Reviewed",
  },
  {
    label: "Streak",
    position: "bottom-[12%] right-[8%]",
    rotate: "rotate-3",
    tone: "commit",
    icon: <FiZap strokeWidth={1.75} aria-hidden />,
    text: "Streak",
  },
];

function Tile({ item, variant }: { item: FloatingItem; variant: 1 | 3 }) {
  const tone = tones[item.tone];
  const surface =
    variant === 1
      ? `border ${tone.tinted} backdrop-blur-xl`
      : `border border-glass-border bg-brand-900 shadow-sm light:bg-white ${tone.text}`;
  return (
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5 ${surface}`}
    >
      {item.icon}
    </span>
  );
}

function Fragment({ item }: { item: FloatingItem }) {
  const tone = tones[item.tone];
  return (
    <span className="flex items-center gap-2.5 rounded-full border border-glass-border bg-glass py-1.5 pl-1.5 pr-3.5 backdrop-blur-xl">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full border ${tone.tinted} [&>svg]:h-3.5 [&>svg]:w-3.5`}
      >
        {item.icon}
      </span>
      <span
        className={`text-sm font-medium text-brand-50 ${item.mono ? "font-mono text-[13px]" : ""}`}
      >
        {item.text}
      </span>
    </span>
  );
}

/** Decorative GitHub activity scattered around the hero. Static; hidden on small screens. */
export function FloatingIcons({ variant = 2 }: { variant?: FloatingVariant }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      {items.map((item) => (
        <span key={item.label} className={`absolute ${item.position} ${item.rotate}`}>
          {variant === 2 ? (
            <Fragment item={item} />
          ) : (
            <Tile item={item} variant={variant} />
          )}
        </span>
      ))}
    </div>
  );
}
