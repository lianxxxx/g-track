import type { ReactNode } from "react";
import type { IconType } from "react-icons";

type Props = {
  id?: string;
  icon: IconType;
  title: string;
  /** Small line under the title, like "Last 7 days". */
  meta?: ReactNode;
  /** Pinned to the right of the heading, like a count or a badge. */
  aside?: ReactNode;
};

/** Card header from the landing bento: hairline icon tile, title, and a muted line under it. */
export function CardHeading({ id, icon: Icon, title, meta, aside }: Props) {
  return (
    <div className="flex items-center gap-4">
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-glass-border text-brand-300"
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 id={id} className="font-heading text-lg font-medium leading-tight text-brand-50">
          {title}
        </h2>
        {meta && <p className="mt-0.5 text-xs text-brand-400">{meta}</p>}
      </div>
      {aside}
    </div>
  );
}
