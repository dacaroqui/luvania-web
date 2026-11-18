"use client";

import { useBooking } from "./providers";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const hotspots = [
  { id: "rostro", label: "Rostro", top: "18%", left: "62%" },
  { id: "brazos", label: "Brazos", top: "58%", left: "8%" },
  { id: "abdomen", label: "Abdomen", top: "74%", left: "46%" },
  { id: "gluteos", label: "Glúteos", top: "86%", left: "70%" },
  { id: "piernas", label: "Piernas", top: "92%", left: "18%" },
];

export function Hero() {
  const { openBooking } = useBooking();
  const reduce = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
      <div>
        <motion.p
          className="text-xs font-bold tracking-[0.2em] text-mute uppercase"
          initial={reduce ? false : { opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Bogotá · cinco sedes · marca de CIFES
        </motion.p>
        <motion.h1
          className="display mt-4 max-w-xl text-5xl leading-[0.95] sm:text-6xl lg:text-7xl"
          initial={reduce ? false : { opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          Elige la zona.
          <span className="block text-coral italic">El protocolo viene después.</span>
        </motion.h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-mute">
          Facial, corporal y capilar con valoración sin costo. Financiamos el plan sin intereses y
          dejamos registro fotográfico de cada proceso.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => openBooking()}
            className="min-h-12 rounded-full bg-coral px-5 text-sm font-bold text-ink"
          >
            Agenda tu valoración sin costo
          </button>
          <Link
            href="/tratamientos"
            className="inline-flex min-h-12 items-center rounded-full border border-ink/15 px-5 text-sm font-bold"
          >
            Ver tratamientos
          </Link>
        </div>
      </div>

      <div
        className="hero-stage relative"
        onMouseMove={(event) => {
          if (reduce) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          setTilt({ x, y });
        }}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div
          className="hero-card relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2rem] bg-peach shadow-[0_30px_80px_rgb(238_135_107_/_0.28)]"
          style={{
            transform: reduce
              ? undefined
              : `rotateX(${(-tilt.y * 6).toFixed(2)}deg) rotateY(${(tilt.x * 8).toFixed(2)}deg)`,
          }}
        >
          <Image
            src="/images/hero-portrait.jpg"
            alt="Retrato de referencia de una mujer en bata marfil, con luz crema y coral. Imagen temporal, lista para cambiar por fotografía de Luvania."
            fill
            priority
            sizes="(min-width: 1024px) 28rem, 90vw"
            className="object-cover object-top"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 55%, rgb(239 236 219 / 0.2) 78%, rgb(239 236 219 / 0.92) 100%)",
              transform: "translateZ(40px)",
            }}
          />
          {hotspots.map((spot) => (
            <Link
              key={spot.id}
              href={`/tratamientos?zona=${spot.id}`}
              className="hotspot hidden md:flex"
              style={{
                top: spot.top,
                left: spot.left,
                transform: reduce ? undefined : "translateZ(70px)",
              }}
            >
              <i aria-hidden="true" />
              {spot.label}
            </Link>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-mute">
          Retrato de marcador. Se reemplaza por fotografía autorizada de la marca.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 md:hidden">
          {hotspots.map((spot) => (
            <li key={spot.id}>
              <Link
                href={`/tratamientos?zona=${spot.id}`}
                className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-bold"
              >
                {spot.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
