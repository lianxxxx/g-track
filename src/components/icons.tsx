/** Shared stroke style for the landing page's drawn icon set. */
export const iconStroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* Icons used by more than one component; one-off icons stay local to their section. */

export function CommitIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconStroke} aria-hidden>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M2.5 12h6.25" />
      <path d="M15.25 12h6.25" />
    </svg>
  );
}

export function PullRequestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconStroke} aria-hidden>
      <circle cx="6" cy="5.5" r="2.25" />
      <circle cx="6" cy="18.5" r="2.25" />
      <circle cx="18" cy="18.5" r="2.25" />
      <path d="M6 7.75v8.5" />
      <path d="M12.5 5h3A2.5 2.5 0 0118 7.5v8.75" />
      <path d="M14.75 2.75L12.5 5l2.25 2.25" />
    </svg>
  );
}

export function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconStroke} aria-hidden>
      <path d="M4.5 20v-5" />
      <path d="M9.5 20V9.5" />
      <path d="M14.5 20v-8" />
      <path d="M19.5 20V4.5" />
    </svg>
  );
}
