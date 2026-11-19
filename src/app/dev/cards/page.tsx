/* eslint-disable @next/next/no-img-element */
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";

export const metadata = pageMeta({
  title: "Estados de cards | Luvania",
  description: "Página interna para revisar los estados visuales de las cards.",
  path: "/dev/cards",
  index: false,
});

export default function CardStatesPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="display text-5xl">Estados de las cards</h1>
      <p className="mt-3 max-w-2xl text-mute">Página interna. No se indexa y no aparece en producción.</p>
      <div className="dev-states mt-8">
        <a className="catalog-card glass" href="#defecto">
          <span className="catalog-card-media">
            <span className="treatment-media"><img src="/tratamientos/plasma-virtual.webp" alt="" /></span>
            <span className="catalog-kicker">Medicina estética</span>
          </span>
          <span className="catalog-card-copy">
            <span className="display catalog-name">Defecto</span>
            <span className="catalog-summary">Foto, nombre, dos líneas y el precio cuando existe.</span>
            <span className="catalog-foot"><span className="catalog-price">Desde $149.900</span><span className="catalog-arrow">→</span></span>
          </span>
        </a>
        <article className="shop-card glass is-added">
          <span className="shop-hit">
            <span className="shop-media"><img src="/tratamientos/toxina-botulinica-tipo-a.webp" alt="" /></span>
            <span className="shop-copy">
              <span className="display shop-name">Agregado</span>
              <span className="shop-now">$1.049.000</span>
            </span>
          </span>
          <button type="button" className="shop-add is-added">Agregado · 1</button>
        </article>
        <article className="shop-card glass is-offline">
          <span className="shop-hit">
            <span className="shop-media"><img src="/tratamientos/detox-reductor.webp" alt="" /></span>
            <span className="shop-copy">
              <span className="display shop-name">No disponible en línea</span>
              <span className="card-flag">No disponible en línea</span>
            </span>
          </span>
        </article>
        <article className="shop-card glass">
          <span className="shop-hit">
            <span className="shop-media"><img src="/tratamientos/hilos-tensores.webp" alt="" /></span>
            <span className="shop-copy">
              <span className="display shop-name">Solo en una sede</span>
              <span className="card-flag">Solo en Chicó</span>
            </span>
          </span>
        </article>
        <article className="shop-card glass is-expired is-offline">
          <span className="shop-hit">
            <span className="shop-media"><img src="/tratamientos/dermapen.webp" alt="" /></span>
            <span className="shop-copy">
              <span className="display shop-name">Vencida</span>
              <span className="card-flag">Vencida</span>
            </span>
          </span>
        </article>
        <button type="button" className="sede-option is-selected">Sede seleccionada · Chicó</button>
        <div className="card-skeleton" aria-hidden="true" />
        <p className="text-sm text-mute">Hover, foco y presión se ven al pasar el cursor o tabular sobre las cards de arriba.</p>
      </div>
    </main>
  );
}
