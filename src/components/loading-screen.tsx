import { BrandMark } from "@/components/brand-logo";

/* Brand loading state: mark, hero tagline, sweeping bar. Used by the route-level
   loading.tsx fallback and by the first-load splash on the landing page. */
export function LoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading g-track"
      className="flex min-h-svh flex-1 flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <div className="animate-fade-up motion-reduce:animate-none">
        <BrandMark size={72} />
      </div>
      <p className="animate-fade-up font-heading text-2xl font-semibold tracking-tight [animation-delay:120ms] motion-reduce:animate-none sm:text-3xl">
        Your GitHub,
        <br />
        but make it iconic.
      </p>
      <div
        aria-hidden="true"
        className="animate-fade-up h-0.5 w-40 overflow-hidden rounded-full bg-glass-border [animation-delay:240ms] motion-reduce:animate-none"
      >
        <div className="h-full w-1/3 rounded-full bg-accent-primary animate-sweep motion-reduce:animate-none" />
      </div>
    </div>
  );
}
