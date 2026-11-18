"use client";

import { sedes } from "@/data/sedes";
import { site } from "@/data/site";
import { useState } from "react";

const destinos = [...sedes.map((sede) => sede.name), "Soporte"];

export function PqrsForm() {
  const [sent, setSent] = useState("");

  return (
    <form
      className="mt-8 grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const nombre = String(data.get("nombre") ?? "").trim();
        const documento = String(data.get("documento") ?? "").trim();
        const telefono = String(data.get("telefono") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const sede = String(data.get("sede") ?? "");
        const asunto = String(data.get("asunto") ?? "").trim();
        const comentario = String(data.get("comentario") ?? "").trim();
        if (!nombre || !documento || !telefono || !email || !sede || !asunto || comentario.length < 20) {
          setSent("Completa todos los campos. El comentario necesita al menos un párrafo corto.");
          return;
        }
        const body = [
          `Nombre: ${nombre}`,
          `Documento: ${documento}`,
          `Teléfono: ${telefono}`,
          `Correo: ${email}`,
          `Sede: ${sede}`,
          "",
          comentario,
        ].join("\n");
        const href = `mailto:${site.email}?subject=${encodeURIComponent(`PQRS: ${asunto}`)}&body=${encodeURIComponent(body)}`;
        setSent("Se abre tu correo con la solicitud lista. Si no se abre, copia el texto y envíalo a servicioalcliente@luvania.com.");
        window.location.href = href;
      }}
    >
      <Field name="nombre" label="Nombre" />
      <Field name="documento" label="Número de documento" />
      <Field name="telefono" label="Teléfono" type="tel" />
      <Field name="email" label="Correo" type="email" />
      <label className="grid gap-1 text-sm font-semibold">
        Sede
        <select name="sede" required defaultValue="" className="min-h-12 rounded-2xl border border-line bg-white px-4 font-normal">
          <option value="" disabled>
            Elige una sede
          </option>
          {destinos.map((destino) => (
            <option key={destino}>{destino}</option>
          ))}
        </select>
      </label>
      <Field name="asunto" label="Asunto" />
      <label className="grid gap-1 text-sm font-semibold">
        Comentario
        <textarea
          name="comentario"
          required
          minLength={20}
          rows={6}
          className="rounded-2xl border border-line bg-white px-4 py-3 font-normal"
          placeholder="Qué pasó, en qué sede y qué esperas que hagamos."
        />
      </label>
      <button type="submit" className="min-h-12 rounded-full bg-coral px-5 text-sm font-bold">
        Preparar el correo de la solicitud
      </button>
      {sent ? (
        <p role="status" className="text-sm leading-6">
          {sent}
        </p>
      ) : null}
    </form>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      <input name={name} type={type} required className="min-h-12 rounded-2xl border border-line bg-white px-4 font-normal" />
    </label>
  );
}
