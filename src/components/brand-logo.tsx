import Image from "next/image";

/** Wordmark that swaps to the dark-on-light asset under the light theme. */
export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <>
      <Image
        src="/brand/logo-wordmark-dark.png"
        alt="g-track"
        width={88}
        height={32}
        priority={priority}
        className="light:hidden"
      />
      <Image
        src="/brand/logo-wordmark-light.png"
        alt="g-track"
        width={88}
        height={32}
        className="hidden light:block"
      />
    </>
  );
}
