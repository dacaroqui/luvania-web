"use client";

import { sedes } from "@/data/sedes";
import { waLink } from "@/lib/format";
import { useId, useState } from "react";

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <div className="fixed right-4 bottom-24 z-40 md:bottom-6">
      <button
        type="button"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#1a1a1a] text-xs font-bold text-cream shadow-lg"
        aria-expanded={open}
        aria-controls="wa-sedes"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Cerrar WhatsApp" : "Abrir WhatsApp y elegir sede"}</span>
        WA
      </button>
      {open ? (
        <div
          id="wa-sedes"
          role="dialog"
          aria-labelledby={titleId}
          className="absolute right-0 bottom-16 w-64 rounded-3xl border border-line bg-paper p-4 shadow-xl"
        >
          <p id={titleId} className="text-sm font-bold">
            ¿A qué sede escribes?
          </p>
          <ul className="mt-3 grid gap-2">
            {sedes.map((sede) => (
              <li key={sede.slug}>
                <a
                  className="flex min-h-11 items-center rounded-2xl bg-white px-3 text-sm font-semibold"
                  href={waLink(
                    sede.whatsapp,
                    `Hola, escribo desde el sitio de Luvania. Quiero información de la sede ${sede.name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {sede.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
