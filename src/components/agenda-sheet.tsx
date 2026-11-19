"use client";

import { heroCopy } from "@/data/hero";
import type { AgendaSede } from "@/data/types";
import { agendaLink } from "@/lib/whatsapp";
import { remember, track } from "@/lib/analytics";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export function AgendaSheet({
  open,
  tratamientoInicial,
  sedeInicial,
  promoInicial,
  sedes,
  onClose,
}: {
  open: boolean;
  tratamientoInicial?: string;
  sedeInicial?: string;
  promoInicial?: string;
  sedes: AgendaSede[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [sedeSlug, setSedeSlug] = useState(sedeInicial ?? "");
  const [formNote, setFormNote] = useState("");
  const [pending, setPending] = useState(false);
  const tratamiento = tratamientoInicial?.trim() ?? "";

  useEffect(() => {
    setSedeSlug(sedeInicial ?? "");
    setFormNote("");
  }, [tratamientoInicial, sedeInicial, promoInicial, open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const interes = tratamiento || "una valoración";

  return (
    <dialog ref={ref} className="sheet glass" aria-labelledby={titleId} onClose={onClose}>
      <div className="grid max-h-[85vh] gap-5 overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="display text-4xl leading-none">
            Agenda tu valoración
          </h2>
          <button type="button" className="min-h-11 min-w-11 text-sm font-bold" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <div className="agenda-summary">
          <p>{tratamiento || "Lo definimos en la valoración"}</p>
          {promoInicial ? <p>{promoInicial}</p> : null}
        </div>
        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold">Sede</legend>
          {sedes.map((sede) => (
            <label key={sede.slug} className={sede.slug === sedeSlug ? "sede-option is-selected" : "sede-option"}>
              <input
                type="radio"
                name="sede-choice"
                value={sede.slug}
                checked={sedeSlug === sede.slug}
                onChange={() => setSedeSlug(sede.slug)}
              />
              {sede.name}
            </label>
          ))}
        </fieldset>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const nombre = String(data.get("nombre") ?? "");
            const celular = String(data.get("celular") ?? "");
            const sede = sedes.find((item) => item.slug === sedeSlug);
            if (!sede) {
              setFormNote("Elige una sede.");
              return;
            }
            setPending(true);
            setFormNote("");
            const response = await fetch("/api/leads", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                nombre,
                celular,
                sede: sede.slug,
                tratamiento: interes,
                promo: promoInicial ?? "",
                consentimiento: data.get("consentimiento") === "on",
                website: String(data.get("website") ?? ""),
              }),
            });
            setPending(false);
            if (!response.ok) {
              const payload = (await response.json().catch(() => null)) as { error?: string } | null;
              setFormNote(payload?.error || "No pudimos enviar tus datos. Inténtalo de nuevo.");
              return;
            }
            remember("luvania_sede", sede.name);
            remember("luvania_tratamiento", interes);
            track("lead_submit", { sede: sede.name, tratamiento: interes });
            track("whatsapp_start", { sede: sede.name, tratamiento: interes });
            const promoLine = promoInicial ? ` Promoción: ${promoInicial}.` : "";
            window.open(
              agendaLink({
                sede: sede.name,
                whatsapp: sede.whatsapp,
                tratamiento: `${interes}.${promoLine} Me llamo ${nombre}. Celular ${celular}`,
                url: window.location.href,
              }),
              "_blank",
              "noopener,noreferrer",
            );
            setFormNote("Listo. Abrimos WhatsApp con la sede, el tratamiento y la promoción.");
          }}
        >
          <label className="absolute -left-[9999px]" aria-hidden="true">
            Sitio web
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Nombre
            <input name="nombre" required autoComplete="name" className="field" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Celular
            <input name="celular" required inputMode="tel" autoComplete="tel" className="field" />
          </label>
          <label className="flex items-start gap-2 text-sm leading-5">
            <input name="consentimiento" type="checkbox" required className="mt-1" />
            <span>
              Autorizo el tratamiento de mis datos para que Luvania me contacte sobre esta valoración, según la Ley
              1581 de 2012 y la{" "}
              <Link className="underline" href="/politicas/datos-personales">
                política de datos
              </Link>
              .
            </span>
          </label>
          <button type="submit" disabled={pending || !sedeSlug} className="btn-coral min-h-12">
            {pending ? "Enviando…" : heroCopy.cta}
          </button>
          {formNote ? (
            <p role="status" className="text-sm leading-6">
              {formNote}
            </p>
          ) : null}
        </form>
      </div>
    </dialog>
  );
}
