"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCompass, FiHelpCircle, FiLayers, FiMenu, FiX } from "react-icons/fi";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

/* Icons show in the mobile menu only; the desktop pill nav stays text. */
const navLinks = [
  { label: "Explore", href: "#features", icon: FiCompass },
  { label: "How it works", href: "#how-it-works", icon: FiLayers },
  { label: "FAQ", href: "#faq", icon: FiHelpCircle },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  /* Which section the reader is currently in, or null while the hero fills the screen. */
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Scrollspy: a section counts as current while it crosses the band sitting
  // 25%-40% down the viewport, so the highlight changes at a natural reading point.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = navLinks.find((link) => visible.has(link.href.slice(1)));
        setActiveId(current ? current.href.slice(1) : null);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 mt-6 bg-brand-950/70 backdrop-blur-xl">
      <div className="relative mx-auto grid h-16 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <Link
          href="/"
          className="flex w-fit items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
        >
          <BrandLogo priority />
        </Link>

        <nav
          aria-label="Main"
          className="col-start-2 hidden items-center gap-1 rounded-full border border-glass-border bg-glass p-1.5 backdrop-blur-xl md:flex"
        >
          {navLinks.map((link) => {
            const isActive = activeId === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent-primary ${
                  isActive
                    ? "text-accent-primary"
                    : "text-brand-300 hover:text-accent-primary"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-3">
          <ThemeToggle />
          {/* One button: sign in also creates the account on first GitHub authorization. */}
          <Link
            href="/login"
            className="hidden h-10 items-center rounded-full bg-accent-primary px-5 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary md:flex"
          >
            Sign in
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-brand-100 transition-colors hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary md:hidden"
          >
            {/* Both icons stay mounted so they can rotate past each other, like the theme toggle. */}
            <FiMenu
              className={`absolute h-5 w-5 transition-[rotate,scale,opacity] duration-300 ease-out motion-reduce:transition-none ${menuOpen ? "rotate-90 scale-0 opacity-0" : ""}`}
              strokeWidth={1.75}
              aria-hidden
            />
            <FiX
              className={`absolute h-5 w-5 transition-[rotate,scale,opacity] duration-300 ease-out motion-reduce:transition-none ${menuOpen ? "" : "-rotate-90 scale-0 opacity-0"}`}
              strokeWidth={1.75}
              aria-hidden
            />
          </button>
        </div>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="absolute inset-x-4 top-[4.25rem] rounded-card border border-glass-border bg-brand-900 p-3 light:bg-brand-950 md:hidden"
          >
            <nav aria-label="Main" className="flex flex-col">
              {navLinks.map((link) => {
                const isActive = activeId === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base transition-colors focus-visible:outline-2 focus-visible:outline-accent-primary ${
                      isActive
                        ? "text-accent-primary"
                        : "text-brand-200 hover:text-accent-primary"
                    }`}
                  >
                    <link.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                    {link.label}
                  </a>
                );
              })}
            </nav>
            <Link
              href="/login"
              className="mt-3 flex h-11 items-center justify-center rounded-full bg-accent-primary text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
