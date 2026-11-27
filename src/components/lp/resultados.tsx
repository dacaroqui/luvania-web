"use client";

import { useState } from "react";
import { CompareSlider } from "./compare-slider";
import { SimulationPanel } from "./simulation-panel";
import type { DensityStyle } from "@/lib/simulation/provider";

const CASES = [
  {
    id: "caso-1",
    before: "linear-gradient(165deg, #f7f1e6 0%, #e7cbb8 100%)",
    after: "linear-gradient(165deg, #f6e4d4 0%, #e7b59a 100%)",
  },
  {
    id: "caso-2",
    before: "linear-gradient(165deg, #efe6d4 0%, #e4c8b0 100%)",
    after: "linear-gradient(165deg, #f8e7dc 0%, #f0a486 100%)",
  },
  {
    id: "caso-3",
    before: "linear-gradient(165deg, #f4ebe0 0%, #ead5c4 100%)",
    after: "linear-gradient(165deg, #f3d7c8 0%, #ee876b 70%)",
  },
];

export function ResultadosReales({
  withMirror = false,
  showPersonalSimulation = true,
}: {
  withMirror?: boolean;
  showPersonalSimulation?: boolean;
}) {
  return withMirror ? <CapillaryExample showPersonalSimulation={showPersonalSimulation} /> : <ResultsCarousel />;
}

function ResultsCarousel() {
  const [index, setIndex] = useState(0);
  const item = CASES[index];
  const go = (delta: number) => setIndex((current) => (current + delta + CASES.length) % CASES.length);

  const example = {
    label: `Comparar el caso ${index + 1}. Foto real autorizada pendiente.`,
    before: <Placeholder tone={item.before} />,
    after: <Placeholder tone={item.after} />,
  };

  return (
    <section className="lp-split" aria-labelledby="resultados-reales">
      <div className="lp-split-copy">
        <h2 id="resultados-reales" className="display">
          Resultados reales de Luvania
        </h2>
        <p>Fotos de pacientes pendientes de autorización.</p>
        <div className="lp-arrows">
          <button type="button" className="lp-arrow" aria-label="Caso anterior" onClick={() => go(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 6.5 9 12l5.5 5.5" />
            </svg>
          </button>
          <button type="button" className="lp-arrow" aria-label="Caso siguiente" onClick={() => go(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.5 6.5 15 12l-5.5 5.5" />
            </svg>
          </button>
          <span>
            {index + 1} / {CASES.length}
          </span>
        </div>
      </div>
      <div className="lp-results-frame">
        <span className="lp-badge">Foto real autorizada pendiente</span>
        <CompareSlider key={item.id} {...example} />
      </div>
    </section>
  );
}

function CapillaryExample({ showPersonalSimulation }: { showPersonalSimulation: boolean }) {
  const examples = {
    masculino: {
      label: "Comparar el ejemplo de densidad en entradas",
      before: <ExamplePhoto style="masculino" side="antes" />,
      after: <ExamplePhoto style="masculino" side="despues" />,
    },
    femenino: {
      label: "Comparar el ejemplo ilustrativo de densidad en la zona superior",
      before: <ExamplePhoto style="femenino" side="antes" />,
      after: <ExamplePhoto style="femenino" side="despues" />,
    },
  };

  return (
    <section className="lp-hair-stage" aria-label="Comparador de densidad capilar">
      <SimulationPanel examples={examples} showPersonalSimulation={showPersonalSimulation} />
    </section>
  );
}

function ExamplePhoto({ side, style }: { side: "antes" | "despues"; style: DensityStyle }) {
  const area = style === "femenino" ? "la zona superior" : "las entradas";
  const alt = side === "antes" ? `Retrato ilustrativo con menor densidad en ${area}` : `El mismo retrato con mayor densidad en ${area}`;
  const file = style === "femenino" ? "capilar-raya" : "capilar-ejemplo";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`hair-demo-photo is-${style}`} src={`/images/${file}-${side}.webp`} alt={alt} width={750} height={750} decoding="async" />
  );
}

function Placeholder({ tone }: { tone: string }) {
  return (
    <div className="lp-ph" style={{ background: tone }}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="24" r="8" />
        <path d="M16 50c2.5-8 8-12 16-12s13.5 4 16 12" />
      </svg>
    </div>
  );
}
