import type { ReactNode } from "react";

type FloatingIcon = {
  label: string;
  position: string;
  tile: string;
  rotate: string;
  delay: string;
  color: string;
  icon: ReactNode;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const icons: FloatingIcon[] = [
  {
    label: "Branches",
    position: "left-[7%] top-[16%]",
    tile: "h-14 w-14",
    rotate: "-rotate-6",
    delay: "0s",
    color: "text-brand-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke} aria-hidden>
        <circle cx="6" cy="6" r="2.25" />
        <circle cx="6" cy="18" r="2.25" />
        <circle cx="18" cy="8" r="2.25" />
        <path d="M6 8.25v7.5" />
        <path d="M18 10.25c0 3.2-2.6 4.75-6 4.75" />
      </svg>
    ),
  },
  {
    label: "Commits",
    position: "left-[15%] top-[54%]",
    tile: "h-12 w-12",
    rotate: "rotate-3",
    delay: "1.1s",
    color: "text-accent-primary",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden>
        <circle cx="12" cy="12" r="3.25" />
        <path d="M2.5 12h6.25" />
        <path d="M15.25 12h6.25" />
      </svg>
    ),
  },
  {
    label: "Stars",
    position: "bottom-[14%] left-[8%]",
    tile: "h-[52px] w-[52px]",
    rotate: "-rotate-3",
    delay: "2.2s",
    color: "text-brand-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" {...stroke} aria-hidden>
        <path d="M12 3.75l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 15.99l-4.8 2.52.92-5.34-3.88-3.78 5.36-.78L12 3.75z" />
      </svg>
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke} aria-hidden>
        <circle cx="6" cy="5.5" r="2.25" />
        <circle cx="6" cy="18.5" r="2.25" />
        <circle cx="18" cy="18.5" r="2.25" />
        <path d="M6 7.75v8.5" />
        <path d="M12.5 5h3A2.5 2.5 0 0118 7.5v8.75" />
        <path d="M14.75 2.75L12.5 5l2.25 2.25" />
      </svg>
    ),
  },
  {
    label: "Code",
    position: "right-[14%] top-[52%]",
    tile: "h-12 w-12",
    rotate: "-rotate-3",
    delay: "1.7s",
    color: "text-brand-200",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke} aria-hidden>
        <path d="M8.5 7.5L4 12l4.5 4.5" />
        <path d="M15.5 7.5L20 12l-4.5 4.5" />
      </svg>
    ),
  },
  {
    label: "Activity",
    position: "bottom-[12%] right-[8%]",
    tile: "h-[52px] w-[52px]",
    rotate: "rotate-3",
    delay: "2.8s",
    color: "text-accent-primary",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" {...stroke} aria-hidden>
        <path d="M4.5 20v-5" />
        <path d="M9.5 20V9.5" />
        <path d="M14.5 20v-8" />
        <path d="M19.5 20V4.5" />
      </svg>
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
