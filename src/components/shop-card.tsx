"use client";

import { canPurchase, type ShopProduct } from "@/data/shop";
import { sedes } from "@/data/sedes";
import { cop } from "@/lib/format";
import Link from "next/link";
import { useCart } from "./cart-store";
import { TreatmentMedia } from "./treatment-media";

export function ShopCard({
  product,
  sesiones,
  sedeHint,
}: {
  product: ShopProduct;
  sesiones?: string | null;
  sedeHint?: string | null;
}) {
  const cart = useCart();
  const purchasable = canPurchase(product);
  const inCart = cart.lines.find((line) => line.slug === product.slug)?.cantidad ?? 0;
  const solo = product.soloEn
    .map((slug) => sedes.find((sede) => sede.slug === slug)?.name ?? slug)
    .join(", ");

  return (
    <li className={`shop-card glass ${purchasable ? "" : "is-offline"} ${product.vencida ? "is-expired" : ""} ${inCart ? "is-added" : ""}`}>
      <Link href={`/tratamientos/${product.slug}`} className="shop-hit">
        <span className="shop-media">
          <TreatmentMedia image={product.imagen} name={product.nombre} decorative />
          {product.descuento ? <span className="shop-badge">-{product.descuento}%</span> : null}
        </span>
        <span className="shop-copy">
          <h2 className="display shop-name">{product.nombre}</h2>
          {sesiones ? <span className="shop-sessions">{sesiones}</span> : null}
          <span className="shop-prices">
            <span className="shop-now">{cop(product.precio)}</span>
            {product.precioAntes ? <span className="shop-before">{cop(product.precioAntes)}</span> : null}
          </span>
          {solo ? <span className="card-flag">Solo en {solo}</span> : null}
          {product.vencida ? <span className="card-flag">Vencida</span> : null}
          {!purchasable && !product.vencida ? <span className="card-flag">No disponible en línea</span> : null}
          <span className="catalog-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </Link>
      {purchasable ? (
        <button
          type="button"
          className={inCart ? "shop-add is-added" : "shop-add"}
          onClick={(event) => {
            event.stopPropagation();
            cart.requestAdd(product.slug, 1, sedeHint || undefined);
          }}
        >
          {inCart ? `Agregado · ${inCart}` : "Agregar al carrito"}
        </button>
      ) : null}
    </li>
  );
}
