import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth-card";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to g-track with your GitHub account.",
  robots: { index: false, follow: false },
};

export default async function LoginPage(props: PageProps<"/login">) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const { error } = await props.searchParams;
  return <AuthCard githubFailed={error !== undefined} />;
}
