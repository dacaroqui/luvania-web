"use client";

import { mockDensitySimulation, type SimulationFrame } from "@/lib/simulation/provider";
import { useEffect, useRef, useState } from "react";
import { CompareSlider } from "./compare-slider";

export function SimulationPanel({ enabled }: { enabled: boolean }) {
  const [consent, setConsent] = useState(false);
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

  if (!enabled) {
    return (
      <section id="como-te-verias" className="lp-block">
        <h2 className="display">¿Cómo te verías?</h2>
        <p className="lp-blocked">La simulación ilustrativa no está disponible todavía.</p>
      </section>
    );
  }

  return (
    <section id="como-te-verias" className="lp-block">
      <div className="lp-block-head">
        <h2 className="display">¿Cómo te verías?</h2>
        <span className="lp-badge">Simulación de ejemplo</span>
      </div>
      <p className="lp-disclaimer">Simulación ilustrativa. No garantiza resultados; tu médico define el plan en la valoración.</p>
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
    </section>
  );
}

function canvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("blob"))), "image/jpeg", 0.9);
  });
}
