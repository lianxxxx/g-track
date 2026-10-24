"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

import { ArtIcon } from "@/components/art-icon";

type Option = { key: string; label: string };

/** "Last 7 days" dropdown. Each option is a link to `?period=`, so the server
 *  renders the chosen window and the choice survives a reload. */
export function PeriodMenu({ options, current }: { options: Option[]; current: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.key === current);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 items-center gap-2 rounded-full border border-glass-border px-4 text-sm text-brand-100 transition-colors hover:border-brand-600 focus-visible:outline-2 focus-visible:outline-accent-primary"
      >
        {/* Hatched calendar, same line art as the sidebar icons. */}
        <span className="text-brand-300">
          <ArtIcon id="period-calendar" hatched={<rect x={3} y={10} width={18} height={12} />}>
            <rect x={3} y={4} width={18} height={18} rx={2} />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </ArtIcon>
        </span>
        {selected?.label}
        <FiChevronDown
          className={`h-4 w-4 shrink-0 text-brand-300 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Time window"
          className="absolute right-0 top-13 z-50 w-48 rounded-card border border-glass-border bg-brand-900 p-2 light:bg-brand-950"
        >
          {options.map((option) => {
            const isCurrent = option.key === current;
            return (
              <Link
                key={option.key}
                href={`?period=${option.key}`}
                scroll={false}
                role="menuitem"
                aria-current={isCurrent ? "true" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent-primary ${
                  isCurrent ? "text-brand-50" : "text-brand-300 hover:text-brand-50"
                }`}
              >
                {option.label}
                {isCurrent && <FiCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
