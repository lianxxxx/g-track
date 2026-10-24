import type { ReactNode } from "react";

/* Menu icons in the line-art style of the theme toggle (landing menu, dashboard sidebar): Feather outlines whose main
   shape is hatched on the lower half. Hand-built because react-icons can't hatch. */
export function ArtIcon({ id, hatched, children }: { id: string; hatched: ReactNode; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
      aria-hidden
    >
      <defs>
        <pattern
          id={`${id}-hatch`}
          width={3}
          height={3}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1={0} y1={0} x2={0} y2={3} strokeWidth={1} />
        </pattern>
        <clipPath id={`${id}-half`}>
          <rect x={0} y={12} width={24} height={12} />
        </clipPath>
      </defs>
      <g fill={`url(#${id}-hatch)`} stroke="none" clipPath={`url(#${id}-half)`}>
        {hatched}
      </g>
      {children}
    </svg>
  );
}
