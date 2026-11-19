"use client";

import { mockDensitySimulation, type SimulationFrame } from "@/lib/simulation/provider";
import { useEffect, useRef, useState } from "react";
import { CompareSlider } from "./compare-slider";

export function SimulationPanel({ enabled }: { enabled: boolean }) {
  const [consent, setConsent] = useState(false);
  const [open, setOpen] = useState(false);
  const [frame, setFrame] = useState<SimulationFrame | null>(null);
  const [error, setError] = useState("");
  const beforeUrl = useRef<string | null>(null);
  const afterUrl = useRef<string | null>(null);
  const [urls, setUrls] = useState<{ before: string; after: string } | null>(null);

  useEffect(() => {
    return () => {
      if (beforeUrl.current) URL.revokeObjectURL(beforeUrl.current);
      if (afterUrl.current) URL.revokeObjectURL(afterUrl.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("simulacion")?.scrollIntoView({ behavior: motion ? "auto" : "smooth", block: "nearest" });
  }, [open]);

  async function onFile(file: File | undefined) {
    if (!file || !consent) return;
    setError("");
    try {
      const bitmap = await createImageBitmap(file);
      const next = await mockDensitySimulation.simulate({ bitmap });
      const beforeBlob = await canvasBlob(next.before);
      const afterBlob = await canvasBlob(next.after);
      if (beforeUrl.current) URL.revokeObjectURL(beforeUrl.current);
      if (afterUrl.current) URL.revokeObjectURL(afterUrl.current);
      beforeUrl.current = URL.createObjectURL(beforeBlob);
      afterUrl.current = URL.createObjectURL(afterBlob);
      setFrame(next);
      setUrls({ before: beforeUrl.current, after: afterUrl.current });
    } catch {
      setError("No se pudo leer esa imagen en este navegador.");
    }
  }

  return (
    <section id="como-te-verias" className="lp-band">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-band-petal" src="/stock/petalo-b.webp" alt="" />
      <div className="lp-band-grid">
        <ExampleSplit />
        <div className="lp-band-copy">
          <h2 className="display">¿Cómo te verías?</h2>
          <p>Visualiza un posible cambio con una simulación ilustrativa de tu tratamiento.</p>
          <ul className="lp-band-points">
            <li>
              <PointIcon path="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
              <span>
                <strong>Referencia visual orientativa</strong>
                Un filtro de ejemplo, no un resultado.
              </span>
            </li>
            <li>
              <PointIcon path="M8 8h2l1.2-2h3.6L16 8h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2ZM12 11.2a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6Z" />
              <span>
                <strong>Con tu foto de forma segura</strong>
                Cámara o archivo, solo en este dispositivo.
              </span>
            </li>
            <li>
              <PointIcon path="M8 11V8.5a4 4 0 0 1 8 0V11M7 11h10v8H7v-8Z" />
              <span>
                <strong>Privada y confidencial</strong>
                La imagen no se envía ni se guarda.
              </span>
            </li>
          </ul>
        </div>
        <div className="lp-band-action">
          {enabled ? (
            <button
              type="button"
              className="btn-coral"
              onClick={() => setOpen(true)}
            >
              <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 8h2l1.2-2h3.6L16 8h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
                <circle cx="13" cy="13.2" r="2.2" />
              </svg>
              Simular mi cambio
            </button>
          ) : (
            <p className="lp-blocked">La simulación ilustrativa no está disponible todavía.</p>
          )}
          <p className="lp-disclaimer">Simulación ilustrativa. No garantiza resultados; tu médico define el plan en la valoración.</p>
        </div>
      </div>
      {enabled && open ? (
        <div id="simulacion" className="lp-sim-flow">
          <label className="lp-consent">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>Acepto usar la cámara o un archivo solo en este dispositivo. La imagen no se envía ni se guarda.</span>
          </label>
          <div className="lp-sim-actions">
            <label className={consent ? "btn-line" : "btn-line is-disabled"}>
              Tomar foto
              <input type="file" accept="image/*" capture="user" disabled={!consent} onChange={(event) => onFile(event.target.files?.[0])} />
            </label>
            <label className={consent ? "btn-line" : "btn-line is-disabled"}>
              Elegir archivo
              <input type="file" accept="image/*" disabled={!consent} onChange={(event) => onFile(event.target.files?.[0])} />
            </label>
          </div>
          {error ? <p className="lp-error">{error}</p> : null}
          {urls && frame ? (
            <div className="lp-sim-result">
              <CompareSlider
                label="Comparar tu foto y la simulación de ejemplo"
                beforeLabel="Tu foto"
                afterLabel="Simulación"
                before={
                  // La foto solo existe en memoria. next/image no sirve un blob.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urls.before} alt="" />
                }
                after={
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urls.after} alt="" />
                }
              />
              <p className="lp-sim-note">El velo de la zona superior es un filtro de ejemplo. No predice cómo vas a quedar.</p>
              <a className="btn-coral" href="#valoracion">
                Iniciar valoración
              </a>
            </div>
          ) : (
            <p className="lp-sim-empty">Cuando aceptes, la foto se procesa aquí mismo. No queda guardada al salir.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}

function ExampleSplit() {
  return (
    <div className="lp-example" aria-hidden="true">
      <div className="lp-example-half" />
      <div className="lp-example-half is-after" />
      <span className="compare-tag is-before">Antes</span>
      <span className="compare-tag is-after">Simulación</span>
      <span className="lp-badge">Ejemplo ilustrativo. No es una paciente.</span>
    </div>
  );
}

function PointIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function canvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("blob"))), "image/jpeg", 0.9);
  });
}
