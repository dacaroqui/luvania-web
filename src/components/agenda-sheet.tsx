"use client";

import { heroCopy } from "@/data/hero";
import type { AgendaSede } from "@/data/types";
import { verifiedCatalog } from "@/data/catalog";
import { agendaLink } from "@/lib/whatsapp";
import { remember, track } from "@/lib/analytics";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const verified = verifiedCatalog();

export function AgendaSheet({
  open,
  tratamientoInicial,
  sedeInicial,
  sedes,
  onClose,
}: {
  open: boolean;
  tratamientoInicial?: string;
  sedeInicial?: string;
  sedes: AgendaSede[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [tratamiento, setTratamiento] = useState(tratamientoInicial ?? "");
  const [sedeSlug, setSedeSlug] = useState(sedeInicial ?? "");
  const [formNote, setFormNote] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setTratamiento(tratamientoInicial ?? "");
    setSedeSlug(sedeInicial ?? "");
  }, [tratamientoInicial, sedeInicial, open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const interes = tratamiento || "una valoración";

  return (
    <dialog ref={ref} className="sheet" aria-labelledby={titleId} onClose={onClose}>
      <div className="grid max-h-[85vh] gap-5 overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="display text-4xl leading-none">
            ¿En qué sede te queda mejor?
          </h2>
          <button type="button" className="min-h-11 min-w-11 text-sm font-bold" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <ul className="grid gap-2">
          {sedes.map((sede) => (
            <li key={sede.slug}>
              <a
                className={`flex min-h-12 items-center justify-between rounded-2xl bg-white px-4 font-semibold ${sede.slug === sedeSlug ? "ring-2 ring-coral" : ""}`}
                href={agendaLink({
                  sede: sede.name,
                  whatsapp: sede.whatsapp,
                  tratamiento: interes,
                  url: "https://luvania.com",
                })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  event.preventDefault();
                  remember("luvania_sede", sede.name);
                  remember("luvania_tratamiento", interes);
                  remember("luvania_origen", window.location.href);
                  track("sede_select", { sede: sede.name, tratamiento: interes });
                  track("whatsapp_start", { sede: sede.name, tratamiento: interes });
                  window.open(
                    agendaLink({
                      sede: sede.name,
                      whatsapp: sede.whatsapp,
                      tratamiento: interes,
                      url: window.location.href,
                    }),
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                <span>{sede.name}</span>
                <span className="text-sm font-normal text-mute">{sede.neighborhood}</span>
              </a>
            </li>
          ))}
        </ul>

        <form
          className="grid gap-3 border-t border-line pt-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const nombre = String(data.get("nombre") ?? "");
            const celular = String(data.get("celular") ?? "");
            const sede = String(data.get("sede") ?? sedeSlug);
            const consentimiento = data.get("consentimiento") === "on";
            setPending(true);
            setFormNote("");
            const response = await fetch("/api/leads", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                nombre,
                celular,
                sede,
                tratamiento,
                consentimiento,
                website: String(data.get("website") ?? ""),
              }),
            });
            setPending(false);
            if (!response.ok) {
              const payload = (await response.json().catch(() => null)) as { error?: string } | null;
              setFormNote(payload?.error || "No pudimos enviar tus datos. Elige una sede y escribe por WhatsApp.");
              return;
            }
            remember("luvania_sede", sedes.find((item) => item.slug === sede)?.name ?? sede);
            remember("luvania_tratamiento", interes);
            track("lead_submit", { sede: sedes.find((item) => item.slug === sede)?.name ?? sede, tratamiento: interes });
            setFormNote("Recibimos tus datos. El equipo de la sede te contacta para la valoración.");
            event.currentTarget.reset();
          }}
        >
          <p className="text-sm font-bold">O déjanos tus datos</p>
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
          <label className="grid gap-1 text-sm font-semibold">
            Sede
            <select name="sede" required value={sedeSlug} onChange={(event) => setSedeSlug(event.target.value)} className="field">
              <option value="" disabled>
                Elige sede
              </option>
              {sedes.map((sede) => (
                <option key={sede.slug} value={sede.slug}>
                  {sede.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Tratamiento <span className="font-normal text-mute">(opcional)</span>
            <select className="field" value={tratamiento} onChange={(event) => setTratamiento(event.target.value)}>
              <option value="">Lo defino en la valoración</option>
              {verified.map((item) => (
                <option key={item.slug} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
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
          <button type="submit" disabled={pending} className="btn-coral min-h-12">
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
