import type { ReactNode } from "react";
import {
  FiBarChart2,
  FiCode,
  FiGitBranch,
  FiGitCommit,
  FiGitPullRequest,
  FiStar,
} from "react-icons/fi";

type FloatingIcon = {
  label: string;
  position: string;
  tile: string;
  rotate: string;
  delay: string;
  color: string;
  icon: ReactNode;
};

const icons: FloatingIcon[] = [
  {
    label: "Branches",
    position: "left-[7%] top-[16%]",
    tile: "h-14 w-14",
    rotate: "-rotate-6",
    delay: "0s",
    color: "text-brand-200",
    icon: <FiGitBranch className="h-6 w-6" strokeWidth={1.75} aria-hidden />,
  },
  {
    label: "Commits",
    position: "left-[15%] top-[54%]",
    tile: "h-12 w-12",
    rotate: "rotate-3",
    delay: "1.1s",
    color: "text-accent-primary",
    icon: <FiGitCommit className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
  },
  {
    label: "Stars",
    position: "bottom-[14%] left-[8%]",
    tile: "h-[52px] w-[52px]",
    rotate: "-rotate-3",
    delay: "2.2s",
    color: "text-brand-200",
    icon: (
      <FiStar className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden />
    ),
  },
  {
    label: "Pull requests",
    position: "right-[7%] top-[14%]",
    tile: "h-14 w-14",
    rotate: "rotate-6",
    delay: "0.6s",
    color: "text-brand-200",
    icon: (
      <FiGitPullRequest className="h-6 w-6" strokeWidth={1.75} aria-hidden />
    ),
  },
  {
    label: "Code",
    position: "right-[14%] top-[52%]",
    tile: "h-12 w-12",
    rotate: "-rotate-3",
    delay: "1.7s",
    color: "text-brand-200",
    icon: <FiCode className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
  },
  {
    label: "Activity",
    position: "bottom-[12%] right-[8%]",
    tile: "h-[52px] w-[52px]",
    rotate: "rotate-3",
    delay: "2.8s",
    color: "text-accent-primary",
    icon: (
      <FiBarChart2
        className="h-[22px] w-[22px]"
        strokeWidth={1.75}
        aria-hidden
      />
    ),
  },
];

/** Decorative floating dev icons around the hero. Hidden on small screens. */
export function FloatingIcons() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      {icons.map((item) => (
        <span key={item.label} className={`absolute ${item.position} ${item.rotate}`}>
          <span
            style={{ animationDelay: item.delay }}
            className={`flex items-center justify-center rounded-2xl border border-glass-border bg-glass shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl motion-safe:animate-float ${item.tile} ${item.color}`}
          >
            {item.icon}
          </span>
        </span>
      ))}
    </div>
  );
}
