import Image from "next/image";

/** Wordmark that swaps to the dark-on-light asset under the light theme.
 *  Both assets share the same 270x96 box (3x), so the swap never shifts layout. */
export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <>
      <Image
        src="/brand/logo-wordmark-dark.webp"
        alt="g-track"
        width={90}
        height={32}
        priority={priority}
        className="light:hidden"
      />
      <Image
        src="/brand/logo-wordmark-light.webp"
        alt="g-track"
        width={90}
        height={32}
        className="hidden light:block"
      />
    </>
  );
}

/** Square "g" mark, same theme swap as the wordmark. Both assets are 512x512.
 *  Both variants preload: the mark only appears on the splash, where a late image would be visible. */
export function BrandMark({ size = 64 }: { size?: number }) {
  return (
    <>
      <Image
        src="/brand/logo-mark-dark.webp"
        alt="g-track"
        width={size}
        height={size}
        priority
        className="light:hidden"
      />
      <Image
        src="/brand/logo-mark-light.webp"
        alt="g-track"
        width={size}
        height={size}
        priority
        className="hidden light:block"
      />
    </>
  );
}
