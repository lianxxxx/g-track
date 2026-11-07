"use client";

import { ErrorScreen } from "@/components/error-screen";

/** 500 for anything that throws below the root layout. The layout (fonts, theme) stays in place. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorScreen error={error} retry={retry} />;
}
