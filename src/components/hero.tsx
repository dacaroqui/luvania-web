import { heroCopy } from "@/data/hero";
import Link from "next/link";
import { BookButton } from "./book-button";
import { FlorLuvania } from "./flor-luvania";
import { HeroMotion } from "./hero-motion";

const labels = [
  { href: "/zonas/rostro", name: "Rostro", style: { top: "14%", left: "4%" } },
  { href: "/zonas/ojos", name: "Ojos", style: { top: "27%", left: "66%" } },
  { href: "/zonas/piel", name: "Piel", style: { top: "42%", left: "68%" } },
  { href: "/zonas/labios", name: "Labios", style: { top: "36%", left: "3%" } },
];

export function Hero() {
  return (
    <section data-tone="cream" className="relative z-[1]">
      <link rel="preload" as="image" href="/brand/hero-lcp.webp" media="(max-width: 768px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/brand/hero-mujer-manual.webp" media="(min-width: 769px)" fetchPriority="high" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16 lg:pb-10">
        <div className="reveal relative z-[1]">
          <p className="text-xs font-bold tracking-[0.22em] text-mute">{heroCopy.eyebrow}</p>
          <h1 className="display mt-4 max-w-xl text-[clamp(2.4rem,11vw,4.5rem)] leading-[0.95] sm:text-6xl lg:text-7xl">{heroCopy.title}</h1>
          <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold">{heroCopy.chip}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookButton />
            <Link href="/tratamientos" className="btn-ghost">
              {heroCopy.secondary}
            </Link>
          </div>
        </div>

        <HeroMotion>
          <div className="layer layer-back hero-wash" />
          <div className="layer layer-flor">
            <FlorLuvania className="flor-hero" />
          </div>
          <div className="layer layer-photo">
            {/* ponytail: img estático para que el LCP no espere al optimizador ni a la hidratación de next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/hero-lcp.webp"
              srcSet="/brand/hero-lcp.webp 640w, /brand/hero-mujer-manual.webp 1500w"
              sizes="(max-width: 768px) 86vw, 32rem"
              alt="Mujer sonriente con la mano en el rostro"
              width={1500}
              height={1083}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain object-bottom"
            />
            {labels.map((label) => (
              <Link key={label.name} href={label.href} className="hotspot" style={label.style}>
                <i aria-hidden="true" />
                {label.name}
              </Link>
            ))}
          </div>
          <svg className="layer layer-grid" viewBox="0 0 360 260" preserveAspectRatio="none" aria-hidden="true">
            <g fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.45">
              <rect x="16" y="14" width="328" height="232" rx="18" />
              <path d="M180 14v232M16 88h328M16 172h328" />
              <path d="M16 40h18M16 220h18M326 40h18M326 220h18M40 14v12M320 14v12M40 234v12M320 234v12" />
            </g>
            <g fill="none" stroke="#ee876b" strokeWidth="0.8" opacity="0.7">
              <circle cx="180" cy="118" r="46" />
              <path d="M168 118h24M180 106v24" />
            </g>
          </svg>
        </HeroMotion>
      </div>
    </section>
  );
}
