import { heroCopy } from "@/data/hero";
import Link from "next/link";
import { BookButton } from "./book-button";
import { HeroParticles } from "./hero-particles";

const zones = [
  { href: "/zonas/rostro", name: "Rostro" },
  { href: "/zonas/ojos", name: "Ojos" },
  { href: "/zonas/labios", name: "Labios" },
  { href: "/zonas/piel", name: "Piel" },
];

export function Hero() {
  return (
    <section data-tone="cream" className="hero-shell relative z-[1]">
      <link rel="preload" as="image" href="/brand/hero-lcp.webp" fetchPriority="high" />
      <HeroParticles />
      <div className="relative z-[1] mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-16 lg:pb-20">
        <div className="reveal max-w-xl">
          <p className="text-xs font-bold tracking-[0.22em] text-clay">{heroCopy.eyebrow}</p>
          <h1 className="display hero-title mt-5">
            <span className="sr-only">{heroCopy.title}</span>
            <span className="hero-rotator" aria-hidden="true">
              {heroCopy.lines.map((line) => (
                <span key={line} className="hero-phrase">
                  {line}
                </span>
              ))}
            </span>
          </h1>
          <p className="hero-lead mt-6 max-w-md text-base leading-relaxed text-mute">{heroCopy.lead}</p>
          <p className="mt-4 text-sm font-semibold tracking-wide text-ink">{heroCopy.chip}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookButton />
            <Link href="/tratamientos" className="btn-ghost">
              {heroCopy.secondary}
            </Link>
          </div>
        </div>

        <div className="hero-figure">
          <div className="hero-frame">
            {/* Recorte editorial de la foto del manual, sin placa negra. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/hero-lcp.webp"
              srcSet="/brand/hero-lcp.webp 1200w, /brand/hero-mujer-manual.webp 1500w"
              sizes="(max-width: 1024px) 92vw, 34rem"
              alt="Mujer sonriente con la mano en el rostro"
              width={1500}
              height={1083}
              fetchPriority="high"
              decoding="async"
              className="hero-portrait"
            />
          </div>
          <ul className="hero-zones">
            {zones.map((zone) => (
              <li key={zone.name}>
                <Link href={zone.href}>{zone.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
