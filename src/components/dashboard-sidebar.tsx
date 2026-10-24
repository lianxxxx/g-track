"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ArtIcon } from "@/components/art-icon";
import { BrandLogo, BrandMark } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

/* One page, so the links jump to its sections. Ids live in src/app/dashboard/page.tsx. */
const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <ArtIcon id="side-overview" hatched={<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </ArtIcon>
    ),
  },
  {
    id: "heatmap",
    label: "Heatmap",
    icon: (
      <ArtIcon
        id="side-heatmap"
        hatched={
          <>
            <rect x={3} y={14} width={7} height={7} />
            <rect x={14} y={14} width={7} height={7} />
          </>
        }
      >
        <rect x={3} y={3} width={7} height={7} />
        <rect x={14} y={3} width={7} height={7} />
        <rect x={14} y={14} width={7} height={7} />
        <rect x={3} y={14} width={7} height={7} />
      </ArtIcon>
    ),
  },
  {
    id: "insights",
    label: "Insights",
    icon: (
      <ArtIcon
        id="side-insights"
        hatched={
          <>
            <rect x={3} y={12} width={4.5} height={9} />
            <rect x={9.75} y={4} width={4.5} height={17} />
            <rect x={16.5} y={9} width={4.5} height={12} />
          </>
        }
      >
        <rect x={3} y={12} width={4.5} height={9} rx={1} />
        <rect x={9.75} y={4} width={4.5} height={17} rx={1} />
        <rect x={16.5} y={9} width={4.5} height={12} rx={1} />
      </ArtIcon>
    ),
  },
  {
    id: "hours",
    label: "Coding hours",
    icon: (
      <ArtIcon id="side-hours" hatched={<circle cx={12} cy={12} r={10} />}>
        <circle cx={12} cy={12} r={10} />
        <path d="M12 6v6l4 2" />
      </ArtIcon>
    ),
  },
];

type Props = { name: string; email: string; image: string | null };

/** Left rail on large screens; a plain top bar below that, where the page is one column anyway. */
export function DashboardSidebar({ name, email, image }: Props) {
  const [activeId, setActiveId] = useState(sections[0].id);
  const [expanded, setExpanded] = useState(false);

  // Scrollspy, same band as the home page header: a section is current while it
  // crosses 25%-40% down the viewport.
  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = sections.find((section) => visible.has(section.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const logo = (
    <Link
      href="/"
      className="flex w-fit items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
    >
      <BrandLogo priority />
    </Link>
  );

  return (
    <>
      <header className="flex h-16 items-center justify-between px-6 lg:hidden">
        {logo}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu name={name} email={email} image={image} />
        </div>
      </header>

      {/* Floating card inset from the window edges. Collapsed it's an icon rail with tooltip
          labels; the panel button opens it into the full sidebar. */}
      <aside
        className={`sticky top-0 z-10 hidden h-screen shrink-0 p-3 transition-[width] duration-300 ease-out motion-reduce:transition-none lg:block ${
          expanded ? "w-64" : "w-20"
        }`}
      >
        <div
          className={`flex h-full flex-col border border-glass-border py-5 ${
            expanded ? "rounded-card px-4" : "items-center rounded-full"
          }`}
        >
          <div className={`flex gap-3 ${expanded ? "items-center justify-between px-2" : "flex-col items-center"}`}>
            {expanded ? (
              logo
            ) : (
              <Link
                href="/"
                className="flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
              >
                <BrandMark size={32} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-300 transition-colors hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary"
            >
              <ArtIcon id="side-toggle" hatched={<rect x={3} y={3} width={6} height={18} />}>
                <rect x={3} y={3} width={18} height={18} rx={2} />
                <path d="M9 3v18" />
              </ArtIcon>
              <span className="sr-only">{expanded ? "Collapse sidebar" : "Expand sidebar"}</span>
            </button>
          </div>

          <nav
            aria-label="Dashboard"
            className={`mt-8 flex flex-col gap-1 ${expanded ? "" : "items-center"}`}
          >
            {sections.map((section) => {
              const isActive = section.id === activeId;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`group relative flex h-10 items-center gap-3 border text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent-primary ${
                    expanded ? "rounded-xl px-3" : "w-10 justify-center rounded-full"
                  } ${
                    isActive
                      ? "border-glass-border text-brand-50"
                      : "border-transparent text-brand-400 hover:text-brand-50"
                  }`}
                >
                  {section.icon}
                  {expanded ? (
                    section.label
                  ) : (
                    <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg border border-glass-border bg-page px-2.5 py-1 text-xs text-brand-50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {section.label}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          <div
            className={`mt-auto flex items-center gap-3 ${
              expanded ? "justify-between" : "flex-col-reverse"
            }`}
          >
            <UserMenu name={name} email={email} image={image} placement="side" />
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
