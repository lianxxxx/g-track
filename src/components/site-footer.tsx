import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { site } from "@/lib/site";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-glass-border px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2.5">
          <Link
            href="/"
            className="flex w-fit items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
          >
            <BrandLogo />
          </Link>
          <p className="text-sm text-brand-300">Every commit counts.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full text-sm text-brand-300 transition-colors hover:text-brand-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-sm text-brand-300">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
