"use client";

import { treatments } from "@/data";
import { sedes } from "@/data/sedes";
import { bookingLink } from "@/lib/whatsapp";
import { useEffect, useId, useRef, useState } from "react";

const names = [...treatments].sort((a, b) => a.name.localeCompare(b.name, "es"));

export function BookingDialog({
  open,
  tratamientoInicial,
  onClose,
}: {
  open: boolean;
  tratamientoInicial?: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [error, setError] = useState("");
  const [tratamiento, setTratamiento] = useState(tratamientoInicial ?? "");

  useEffect(() => {
    setTratamiento(tratamientoInicial ?? "");
  }, [tratamientoInicial]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <form
        className="grid gap-4 p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const nombre = String(data.get("nombre") ?? "");
          const telefono = String(data.get("telefono") ?? "");
          const sedeSlug = String(data.get("sede") ?? "");
          const digits = telefono.replace(/\D/g, "");
          if (nombre.trim().length < 2) {
            setError("Escribe tu nombre.");
            return;
          }
          if (digits.length < 7 || digits.length > 15) {
            setError("Revisa el teléfono. Puede ser celular o fijo.");
            return;
          }
          const sede = sedes.find((item) => item.slug === sedeSlug);
          if (!sede) {
            setError("Elige una sede.");
            return;
          }
          setError("");
          const url = bookingLink({
            nombre,
            telefono,
            sede: sede.name,
            whatsapp: sede.whatsapp,
            tratamiento,
          });
          window.open(url, "_blank", "noopener,noreferrer");
          onClose();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-coral uppercase">Valoración sin costo</p>
            <h2 id={titleId} className="display mt-1 text-3xl">
              Agenda en tu sede
            </h2>
          </div>
          <button type="button" className="min-h-11 min-w-11 rounded-full text-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <p className="text-sm leading-6 text-mute">
          Tres datos y se abre WhatsApp con el mensaje listo. No guardamos el formulario en un servidor.
        </p>
        <label className="grid gap-1 text-sm font-semibold">
          Nombre
          <input
            name="nombre"
            required
            autoComplete="name"
            className="min-h-12 rounded-2xl border border-line bg-white px-4 font-normal"
            placeholder="Tu nombre"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Teléfono
          <input
            name="telefono"
            required
            inputMode="tel"
            autoComplete="tel"
            className="min-h-12 rounded-2xl border border-line bg-white px-4 font-normal"
            placeholder="300 000 0000"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Sede
          <select name="sede" required defaultValue="" className="min-h-12 rounded-2xl border border-line bg-white px-4 font-normal">
            <option value="" disabled>
              Elige sede
            </option>
            {sedes.map((sede) => (
              <option key={sede.slug} value={sede.slug}>
                {sede.name} — {sede.address}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Tratamiento <span className="font-normal text-mute">(opcional)</span>
          <select
            value={tratamiento}
            onChange={(event) => setTratamiento(event.target.value)}
            className="min-h-12 rounded-2xl border border-line bg-white px-4 font-normal"
          >
            <option value="">Lo defino en la valoración</option>
            {names.map((item) => (
              <option key={item.slug} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        {error ? (
          <p role="alert" className="text-sm font-semibold text-ink">
            {error}
          </p>
        ) : null}
        <button type="submit" className="min-h-12 rounded-full bg-coral px-5 text-sm font-bold text-ink">
          Abrir WhatsApp con el mensaje
        </button>
      </form>
    </dialog>
  );
}
