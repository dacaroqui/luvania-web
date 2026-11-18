import { heroCopy } from "@/data/hero";
import Link from "next/link";
import { BookButton } from "./book-button";
import { HeroBlooms } from "./hero-blooms";
import { HeroParticles } from "./hero-particles";
import { HeroStage } from "./hero-stage";

export function Hero() {
  return (
    <section data-tone="cream" className="hero-shell relative z-[1]">
      <link rel="preload" as="image" href="/brand/hero-lcp.webp" fetchPriority="high" />
      <div className="hero-grid relative z-[1] mx-auto grid max-w-6xl items-center gap-4 px-4 pt-6 pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-16 lg:pb-20">
        <div className="hero-copy">
          <p className="text-xs font-bold tracking-[0.22em] text-clay uppercase">{heroCopy.eyebrow}</p>
          <h1 className="display hero-title mt-4">{heroCopy.title}</h1>
          <p className="hero-lead mt-5 max-w-md text-base leading-relaxed text-mute sm:text-lg">{heroCopy.lead}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <BookButton />
            <Link href="/tratamientos" className="hero-secondary">
              {heroCopy.secondary}
            </Link>
          </div>
        </div>

        <HeroStage>
          <div className="hero-halo" aria-hidden="true" />
          <div className="hero-contact" aria-hidden="true" />
          <HeroParticles />
          <div className="hero-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/hero-lcp.webp"
              srcSet="/brand/hero-lcp.webp 1200w, /brand/hero-mujer-manual.webp 1500w"
              sizes="(max-width: 1024px) 46vw, 34rem"
              alt="Retrato editorial de Luvania"
              width={1500}
              height={1083}
              fetchPriority="high"
              decoding="async"
              className="hero-portrait"
            />
          </div>
          <HeroBlooms />
        </HeroStage>
      </div>
    </section>
  );
}
