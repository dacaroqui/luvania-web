"use client";

import { forZone } from "@/lib/hubs";
import Link from "next/link";
import { useState } from "react";

const pins = [
  { id: "rostro", name: "Rostro", href: "/zonas/rostro", x: 55, y: 10, side: "right", glow: 20 },
  { id: "ojos", name: "Ojos", href: "/zonas/ojos", x: 46, y: 11, side: "left", glow: 12 },
  { id: "labios", name: "Labios", href: "/zonas/labios", x: 50, y: 14.3, side: "left", glow: 11 },
  { id: "cuello", name: "Cuello", href: "/zonas/cuello", x: 53, y: 18.4, side: "right", glow: 13 },
  { id: "piel", name: "Piel", href: "/zonas/piel", x: 44, y: 24.5, side: "left", glow: 22 },
  { id: "brazos", name: "Brazos", href: "/zonas/brazos", x: 60, y: 33, side: "right", glow: 14 },
  { id: "abdomen", name: "Abdomen", href: "/zonas/abdomen", x: 48, y: 34.5, side: "left", glow: 16 },
  { id: "gluteos", name: "Caderas", href: "/zonas/gluteos", x: 42, y: 43, side: "left", glow: 16 },
  { id: "piernas", name: "Piernas", href: "/zonas/piernas", x: 55, y: 62, side: "right", glow: 14 },
] as const;

type ZoneId = (typeof pins)[number]["id"];

export function BodyMap() {
  const [selected, setSelected] = useState<ZoneId>("rostro");
  const [hover, setHover] = useState<ZoneId | null>(null);
  const lit = hover ?? selected;
  const zone = pins.find((item) => item.id === selected) ?? pins[0];
  const treatments = forZone(selected);

  return (
    <div className="body-layout">
      <div className="body-intro">
        <p className="body-kicker">Luvania</p>
        <h2 className="display">Elige por el cuerpo</h2>
        <p>Explora los tratamientos según la zona que te gustaría cuidar.</p>
        <p className="body-hint">
          <HandIcon />
          Selecciona un punto o usa la lista de zonas.
        </p>
      </div>

      <div className="body-stage" onMouseLeave={() => setHover(null)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="body-figure" src="/brand/cuerpo-ilustracion.webp" alt="" width={864} height={1152} loading="lazy" />
        {pins.map((pin) =>
          pin.id === lit ? (
            <span
              key={`${pin.id}-glow`}
              className="zone-glow"
              style={{ left: `${pin.x}%`, top: `${pin.y}%`, width: `${pin.glow}%` }}
            />
          ) : null,
        )}
        {pins.map((pin) => {
          const on = selected === pin.id;
          return (
            <button
              key={pin.id}
              type="button"
              className={`zone-pin is-${pin.side} ${on ? "is-on" : ""}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%`, ["--lead" as string]: "1.2rem" }}
              aria-pressed={on}
              aria-label={pin.name}
              onPointerEnter={(event) => { if (event.pointerType === "mouse") setHover(pin.id); }}
              onFocus={() => setHover(pin.id)}
              onBlur={() => setHover((value) => (value === pin.id ? null : value))}
              onClick={() => { setSelected(pin.id); setHover(null); }}
            >
              <span className="zone-dot" />
              <span className="zone-rule" />
              <span className="zone-pill">{pin.name}</span>
            </button>
          );
        })}
      </div>

      <div className="body-panel">
        <div className="body-chips" onMouseLeave={() => setHover(null)} role="group" aria-label="Zonas del cuerpo">
          {pins.map((pin) => (
            <button
              key={pin.id}
              type="button"
              className={selected === pin.id ? "is-on" : ""}
              aria-pressed={selected === pin.id}
              onMouseEnter={() => setHover(pin.id)}
              onFocus={() => setHover(pin.id)}
              onBlur={() => setHover((value) => (value === pin.id ? null : value))}
              onClick={() => setSelected(pin.id)}
            >
              {pin.name}
            </button>
          ))}
        </div>
        <p className="sr-only" role="status">{zone.name}: {treatments.length} tratamientos disponibles.</p>
        <div key={zone.id} className="body-zone">
          <div className="body-zone-head">
            <h3 className="display">{zone.name}</h3>
            <Link href={zone.href}>
              Ver todos <span aria-hidden="true">↗</span>
            </Link>
          </div>
          {treatments.length === 0 ? (
            <p className="body-empty">Todavía no hay un protocolo publicado para esta zona.</p>
          ) : (
            <ul className="body-list">
              {treatments.slice(0, 5).map((item, index) => (
                <li key={item.slug} style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}>
                  <Link href={`/tratamientos/${item.slug}`} className="zone-row">
                    <RowIcon kind={item.especialidad} />
                    <span>{item.name}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function HandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 11V6.5a1.2 1.2 0 0 1 2.4 0V11" />
      <path d="M10.4 10.2V5.2a1.2 1.2 0 0 1 2.4 0v5" />
      <path d="M12.8 10.6V6.4a1.2 1.2 0 0 1 2.4 0V12" />
      <path d="M8 11.2c-.8.4-2.2 1.6-2.2 3.6 0 2.8 2.2 5.2 6.2 5.2 3.2 0 5.8-1.6 5.8-4.4V10.2a1.2 1.2 0 0 0-2.4 0" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 11 11 5M6.5 5H11v4.5" />
    </svg>
  );
}

function RowIcon({ kind }: { kind: string }) {
  if (kind === "obesidad-y-sobrepeso") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="7" cy="12" r="2.2" />
        <circle cx="17" cy="8" r="2.2" />
        <circle cx="16" cy="16.5" r="2.2" />
        <path d="M9 11.2 15 8.8M9 13.2l5.2 2.4" />
      </svg>
    );
  }
  if (kind === "estetica-corporal" || kind === "nutricion-capilar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 15c2.2-3 4-3 6.2 0s4 3 6.2 0" />
        <path d="M5 10c2.2-3 4-3 6.2 0s4 3 6.2 0" />
      </svg>
    );
  }
  if (kind === "medicina-estetica") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 8.5v7M8.5 12h7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.5 13.4 9H18l-3.7 2.8 1.4 4.5L12 13.6 8.3 16.3l1.4-4.5L6 9h4.6L12 4.5Z" />
    </svg>
  );
}
