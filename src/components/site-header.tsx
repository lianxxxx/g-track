"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 mt-6 bg-brand-950/70 backdrop-blur-xl">
      <div className="relative mx-auto grid h-16 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <Link
          href="/"
          className="flex w-fit items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
        >
          <Image
            src="/brand/logo-wordmark-dark.png"
            alt="g-track"
            width={88}
            height={32}
            priority
          />
        </Link>

        <nav
          aria-label="Main"
          className="col-start-2 hidden items-center gap-1 rounded-full border border-glass-border bg-glass p-1.5 backdrop-blur-xl md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm text-brand-300 transition-colors hover:bg-glass hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-3">
          <a
            href="#"
            className="hidden h-10 items-center rounded-full border border-glass-border px-5 text-sm font-medium text-brand-100 transition-colors hover:border-brand-600 hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary md:flex"
          >
            Log in
          </a>
          <a
            href="#"
            className="hidden h-10 items-center rounded-full bg-accent-primary px-5 text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary md:flex"
          >
            Sign up
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-glass transition-colors hover:border-brand-600 focus-visible:outline-2 focus-visible:outline-accent-primary md:hidden"
          >
            <span className="flex h-4 w-4 flex-col items-center justify-center gap-[5px]">
              <span
                className={`h-0.5 w-4 rounded-full bg-brand-50 transition-transform duration-200 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-0.5 w-4 rounded-full bg-brand-50 transition-transform duration-200 ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="absolute inset-x-4 top-[4.25rem] rounded-card border border-glass-border bg-brand-900/95 p-3 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Main" className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-base text-brand-200 transition-colors hover:bg-glass hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-glass-border pt-3">
              <a
                href="#"
                className="flex h-11 items-center justify-center rounded-full border border-glass-border text-sm font-medium text-brand-100 transition-colors hover:border-brand-600 hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-accent-primary"
              >
                Log in
              </a>
              <a
                href="#"
                className="flex h-11 items-center justify-center rounded-full bg-accent-primary text-sm font-medium text-brand-950 transition-colors hover:bg-accent-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
              >
                Sign up
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
