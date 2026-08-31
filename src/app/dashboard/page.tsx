import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { FiBarChart2, FiCheck, FiRefreshCw } from "react-icons/fi";

import { BrandLogo } from "@/components/brand-logo";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

type Status = "done" | "building" | "next";

type Step = {
  title: string;
  body: string;
  status: Status;
  icon: ReactNode;
};

const steps: Step[] = [
  {
    title: "Sign in",
    body: "Done. Your GitHub account is linked.",
    status: "done",
    icon: <FiCheck className="h-5 w-5" strokeWidth={2} aria-hidden />,
  },
  {
    title: "Sync",
    body: "Being built. Commits, PRs, issues, and reviews will land here.",
    status: "building",
    icon: <FiRefreshCw className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
  },
  {
    title: "Slay",
    body: "Up next. Your board: heatmap, feed, and insights from real activity.",
    status: "next",
    icon: <FiBarChart2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
  },
];

const statusLabel: Record<Status, string> = {
  done: "Done",
  building: "In progress",
  next: "Up next",
};

const statusTone: Record<Status, string> = {
  done: "bg-accent-primary-soft text-accent-primary",
  building: "border border-glass-border bg-glass text-brand-200",
  next: "border border-glass-border text-brand-400",
};

const iconTone: Record<Status, string> = {
  done: "border-accent-primary/30 bg-accent-primary-soft text-accent-primary",
  building: "border-glass-border bg-glass text-brand-200",
  next: "border-glass-border bg-glass text-brand-400",
};

/** Signed-in area while the real board is being built: shows where the product is. */
export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { user } = session;
  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <>
      <header className="mt-6">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex w-fit items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary"
          >
            <BrandLogo priority />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user.image && (
              <Image
                src={user.image}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border border-glass-border"
              />
            )}
            <span className="hidden text-sm text-brand-200 sm:inline">
              {user.name}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-16 sm:py-24">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hi {firstName}, you&apos;re in.
          </h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-brand-300">
            Your commits are already counting. The board is next.
          </p>
        </div>

        <ol className="mt-12 w-full max-w-xl rounded-card border border-glass-border bg-glass p-6 backdrop-blur-xl sm:p-8">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-5">
              <div aria-hidden className="flex flex-col items-center">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconTone[step.status]}`}
                >
                  {step.icon}
                </span>
                {index < steps.length - 1 && (
                  <span className="my-2 w-px flex-1 bg-glass-border" />
                )}
              </div>
              <div className={index < steps.length - 1 ? "pb-8" : ""}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2.5">
                  <h2 className="text-lg font-semibold text-brand-50">
                    {step.title}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusTone[step.status]}`}
                  >
                    {statusLabel[step.status]}
                  </span>
                </div>
                <p className="mt-1.5 leading-7 text-brand-300">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
