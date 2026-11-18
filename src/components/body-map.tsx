"use client";

import { forZone } from "@/lib/hubs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const zones = [
  { id: "rostro", name: "Rostro", href: "/zonas/rostro", x: 50, y: 8.3, halo: 22 },
  { id: "ojos", name: "Ojos", href: "/zonas/ojos", x: 50, y: 11, halo: 16 },
  { id: "labios", name: "Labios", href: "/zonas/labios", x: 50, y: 13, halo: 12 },
  { id: "cuello", name: "Cuello", href: "/zonas/cuello", x: 50, y: 17.6, halo: 14 },
  { id: "piel", name: "Piel", href: "/zonas/piel", x: 57, y: 28.5, halo: 22 },
  { id: "brazos", name: "Brazos", href: "/zonas/brazos", x: 38.2, y: 35, halo: 18 },
  { id: "abdomen", name: "Abdomen", href: "/zonas/abdomen", x: 50, y: 37.5, halo: 22 },
  { id: "gluteos", name: "Caderas", href: "/zonas/gluteos", x: 50, y: 49.2, halo: 30 },
  { id: "piernas", name: "Piernas", href: "/zonas/piernas", x: 45.6, y: 66, halo: 26 },
] as const;

type ZoneId = (typeof zones)[number]["id"];

export function BodyMap() {
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [hover, setHover] = useState<ZoneId | null>(null);
  const [pinned, setPinned] = useState<ZoneId | null>(null);
  const current = hover ?? pinned;
  const zone = zones.find((item) => item.id === current) ?? null;
  const treatments = current ? forZone(current) : [];

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
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
    <div
      ref={root}
      className={`body-map ${shown ? "is-shown" : ""}`}
      onMouseLeave={() => setHover(null)}
    >
      <div className="body-stage">
        <div className="body-in">
          <div className="body-breathe">
            <Image
              src="/brand/cuerpo-ilustracion.webp"
              alt="Ilustración de un cuerpo femenino de frente, en línea coral"
              fill
              sizes="(max-width: 768px) 88vw, 440px"
              className="body-figure object-contain"
            />
            {zone ? (
              <span
                className="body-halo"
                style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.halo}%`, height: `${zone.halo * 0.75}%` }}
              />
            ) : null}
            {zones.map((item, index) => {
              const on = current === item.id;
              const side = item.x < 48 ? "is-left" : "is-right";
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`body-point ${side} ${on ? "is-on" : ""}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%`, transitionDelay: `${180 + index * 70}ms` }}
                  aria-label={item.name}
                  aria-pressed={on}
                  onMouseEnter={() => setHover(item.id)}
                  onFocus={() => setHover(item.id)}
                  onClick={() => choose(item.id)}
                >
                  <span className="body-dot" />
                  <span className="body-tag">
                    <span className="body-line" />
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="body-panel">
        <div className="body-chips" aria-label="Zonas del cuerpo">
          {zones.map((item) => (
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
          <div key={zone.id}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="display text-3xl">{zone.name}</h3>
              <Link href={zone.href} className="text-sm font-bold underline decoration-coral underline-offset-4">
                Ver zona
              </Link>
            </div>
            <ul className="mt-4 grid gap-2">
              {treatments.map((item, index) => (
                <li key={item.slug} className="body-treat" style={{ animationDelay: `${index * 45}ms` }}>
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
