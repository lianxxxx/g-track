import { BrandMark } from "@/components/brand-logo";

/* Brand loading state: mark, sweeping bar, and tagline fade up together.
   Used by the route-level loading.tsx fallback and by the first-load splash on the landing page. */
export function LoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading g-track"
      className="flex min-h-svh flex-1 flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <div className="animate-fade-up motion-reduce:animate-none">
        <BrandMark size={56} />
      </div>
      <div
        aria-hidden="true"
        className="animate-fade-up h-0.5 w-32 overflow-hidden rounded-full bg-glass-border motion-reduce:animate-none"
      >
        <div className="h-full w-1/3 rounded-full bg-accent-primary animate-sweep motion-reduce:animate-none" />
      </div>
      <p className="animate-fade-up text-sm text-brand-300 motion-reduce:animate-none">
        Your GitHub, but make it iconic.
      </p>
    </div>
  );
}
