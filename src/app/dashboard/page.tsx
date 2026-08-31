import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/** Placeholder shell for the signed-in area. The board itself arrives with GitHub sync. */
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

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Hi {firstName}, you&apos;re in.
        </h1>
        <p className="mt-4 max-w-md text-lg leading-8 text-brand-300">
          Your board is next. GitHub sync lands in the next slice, and your
          activity shows up here the moment it does.
        </p>
      </main>
    </>
  );
}
