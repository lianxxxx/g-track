import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth-card";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your g-track account with GitHub.",
  robots: { index: false, follow: false },
};

/** Same GitHub OAuth flow as /login; the account is created on first authorization. */
export default async function SignupPage(props: PageProps<"/signup">) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const { error } = await props.searchParams;
  return <AuthCard mode="signup" githubFailed={error !== undefined} />;
}
