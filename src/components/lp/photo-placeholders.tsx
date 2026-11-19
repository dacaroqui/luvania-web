"use client";

import { CompareSlider } from "./compare-slider";

export function PhotoPlaceholders() {
  return (
    <section className="lp-block" aria-labelledby="antes-despues">
      <div className="lp-block-head">
        <h2 id="antes-despues" className="display">
          Antes y después
        </h2>
        <span className="lp-badge">Foto real autorizada pendiente</span>
      </div>
      <CompareSlider
        label="Comparar el antes y el después cuando existan las fotos autorizadas"
        before={<div className="lp-photo-ph">Antes</div>}
        after={<div className="lp-photo-ph is-after">Después</div>}
      />
    </section>
  );
}

export function DoctorPlaceholder() {
  return (
    <div className="lp-doctor">
      <svg viewBox="0 0 160 220" aria-hidden="true">
        <path d="M80 18a22 22 0 1 1 0 44 22 22 0 0 1 0-44Z" />
        <path d="M48 78c8-14 20-20 32-20s24 6 32 20l18 78c2 10-6 18-16 18H46c-10 0-18-8-16-18l18-78Z" />
        <path d="M70 96h20M80 88v28" />
      </svg>
      <span className="lp-badge">Foto real pendiente</span>
    </div>
  );
}
