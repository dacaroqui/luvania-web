"use client";

import { forZone } from "@/lib/hubs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const face = [
  { id: "rostro", name: "Rostro", href: "/zonas/rostro", x: 50, y: 8.6, halo: 18 },
  { id: "ojos", name: "Ojos", href: "/zonas/ojos", x: 50, y: 11, halo: 14 },
  { id: "labios", name: "Labios", href: "/zonas/labios", x: 50, y: 13.1, halo: 12 },
] as const;

const body = [
  { id: "cuello", name: "Cuello", href: "/zonas/cuello", x: 50, y: 17.6, halo: 14, label: "right" as const },
  { id: "brazos", name: "Brazos", href: "/zonas/brazos", x: 38.3, y: 35, halo: 16, label: "left" as const },
  { id: "brazos", name: "Brazos", href: "/zonas/brazos", x: 61.7, y: 35, halo: 16, label: "right" as const },
  { id: "abdomen", name: "Abdomen", href: "/zonas/abdomen", x: 50, y: 37.5, halo: 22, label: "right" as const },
  { id: "gluteos", name: "Caderas", href: "/zonas/gluteos", x: 37, y: 46.2, halo: 16, label: "left" as const },
  { id: "gluteos", name: "Caderas", href: "/zonas/gluteos", x: 63, y: 46.2, halo: 16, label: "right" as const },
  { id: "piernas", name: "Piernas", href: "/zonas/piernas", x: 45.4, y: 66, halo: 18, label: "left" as const },
  { id: "piernas", name: "Piernas", href: "/zonas/piernas", x: 54.6, y: 66, halo: 18, label: "right" as const },
] as const;

const chips = [
  ...face.map(({ id, name, href }) => ({ id, name, href })),
  { id: "cuello", name: "Cuello", href: "/zonas/cuello" },
  { id: "piel", name: "Piel", href: "/zonas/piel" },
  { id: "brazos", name: "Brazos", href: "/zonas/brazos" },
  { id: "abdomen", name: "Abdomen", href: "/zonas/abdomen" },
  { id: "gluteos", name: "Caderas", href: "/zonas/gluteos" },
  { id: "piernas", name: "Piernas", href: "/zonas/piernas" },
] as const;

type ZoneId = (typeof chips)[number]["id"];
type HoverId = ZoneId | "cabeza" | null;

const faceIds = new Set<ZoneId>(face.map((item) => item.id));

export function BodyMap() {
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [hover, setHover] = useState<HoverId>(null);
  const [pinned, setPinned] = useState<ZoneId | null>(null);
  let current: ZoneId | null = pinned;
  if (hover === "cabeza") current = pinned && faceIds.has(pinned) ? pinned : null;
  else if (hover) current = hover;
  const zone = chips.find((item) => item.id === current) ?? null;
  const treatments = current ? forZone(current) : [];
  const showFace =
    hover === "cabeza" ||
    (hover !== null && faceIds.has(hover)) ||
    (hover === null && pinned !== null && faceIds.has(pinned));
  const halo = current ? [...face, ...body].find((item) => item.id === current) : null;

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.28 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function choose(id: ZoneId) {
    setHover(id);
    setPinned(id);
  }

  return (
    <div ref={root} className={`body-map ${shown ? "is-shown" : ""}`} onMouseLeave={() => setHover(null)}>
      <div className="body-stage">
        <div className="body-in">
          <div className="body-breathe">
            <Image
              src="/brand/cuerpo-ilustracion.webp"
              alt="Ilustración de un cuerpo femenino de frente, en línea coral"
              fill
              sizes="(max-width: 768px) 100vw, 540px"
              className="body-figure object-contain"
            />
            {current === "piel" ? <span className="body-halo body-halo-skin" /> : null}
            {current === "brazos" || current === "piernas" || current === "gluteos"
              ? body
                  .filter((item) => item.id === current)
                  .map((item) => (
                    <span key={`${item.id}-${item.x}`} className="body-halo" style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.halo}%` }} />
                  ))
              : halo && current !== "piel" ? (
                  <span className="body-halo" style={{ left: `${halo.x}%`, top: `${halo.y}%`, width: `${halo.halo}%` }} />
                ) : null}

            <button
              type="button"
              className={`body-point is-right ${showFace ? "is-on" : ""}`}
              style={{ left: "50%", top: "10.2%", transitionDelay: "180ms" }}
              aria-label="Rostro, ojos y labios"
              aria-expanded={showFace}
              onMouseEnter={() => setHover("cabeza")}
              onFocus={() => setHover("cabeza")}
              onClick={() => setHover("cabeza")}
            >
              <span className="body-dot" />
            </button>
            {showFace ? (
              <div className="body-face" onMouseEnter={() => setHover("cabeza")}>
                {face.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={current === item.id ? "is-on" : ""}
                    aria-pressed={current === item.id}
                    onMouseEnter={() => setHover(item.id)}
                    onFocus={() => setHover(item.id)}
                    onClick={() => choose(item.id)}
                  >
                    <span className="body-line" />
                    {item.name}
                  </button>
                ))}
              </div>
            ) : null}

            {body.map((item, index) => {
              const on = current === item.id;
              const primary = item.x > 50 || (item.id !== "brazos" && item.id !== "piernas" && item.id !== "gluteos");
              return (
                <button
                  key={`${item.id}-${item.x}`}
                  type="button"
                  className={`body-point is-${item.label} ${on ? "is-on" : ""}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%`, transitionDelay: `${250 + index * 60}ms` }}
                  aria-label={item.name}
                  aria-pressed={on}
                  onMouseEnter={() => setHover(item.id)}
                  onFocus={() => setHover(item.id)}
                  onClick={() => choose(item.id)}
                >
                  <span className="body-dot" />
                  {on && primary ? (
                    <span className="body-tag">
                      <span className="body-line" />
                      {item.name}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="body-panel">
        <div className="body-chips" aria-label="Zonas del cuerpo">
          {chips.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`body-chip ${current === item.id ? "is-on" : ""}`}
              aria-pressed={current === item.id}
              onMouseEnter={() => setHover(item.id)}
              onFocus={() => setHover(item.id)}
              onClick={() => choose(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        {zone ? (
          <div key={zone.id} className="body-zone">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="display text-3xl">{zone.name}</h3>
              <Link href={zone.href} className="text-sm font-bold underline decoration-coral underline-offset-4">
                Ver todos
              </Link>
            </div>
            <ul className="body-list mt-3">
              {treatments.map((item, index) => (
                <li key={item.slug} className="body-treat" style={{ animationDelay: `${index * 40}ms` }}>
                  <Link href={`/tratamientos/${item.slug}`} className="body-treat-link">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            {treatments.length === 0 ? <p className="mt-3 text-sm text-mute">Agenda una valoración para esta zona.</p> : null}
          </div>
        ) : (
          <p className="text-mute">Pasa por una zona o tócala para ver sus tratamientos.</p>
        )}
      </div>
    </div>
  );
}
