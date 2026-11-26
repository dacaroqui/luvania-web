import { treatmentCardImage } from "./treatment-card-images";
import { verifiedCatalog } from "./catalog";
import { offerForTreatment } from "./offers";
import { purchaseTerms, type TipoPrecio } from "./purchase";
import { sedes } from "./sedes";
import { especialidadBySlug, needById, zoneById } from "./taxonomy";
import type { CatalogItem } from "./types";

export type CommerceProduct = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  especialidad: string;
  especialidadNombre: string;
  necesidades: string[];
  necesidadNombres: string[];
  zonas: string[];
  zonaNombres: string[];
  imagen?: string;
  precio: number | null;
  moneda: "COP";
  precioPromocional: number | null;
  requiereValoracion: boolean;
  disponibleOnline: boolean;
  tipoPrecio: TipoPrecio;
  sedes: string[];
};

const sedeSlugs = sedes.map((sede) => sede.slug);

function prices(slug: string) {
  const offer = offerForTreatment(slug);
  if (!offer) return { precio: null, precioPromocional: null };
  if (offer.priceBeforeSuspicious || offer.priceBefore <= offer.priceNow) {
    return { precio: offer.priceNow, precioPromocional: null };
  }
  return { precio: offer.priceBefore, precioPromocional: offer.priceNow };
}

export function commerceCatalog(): CommerceProduct[] {
  return verifiedCatalog().map((item) => {
    const money = prices(item.slug);
    const terms = purchaseTerms(item.slug);
    return {
      id: item.slug,
      nombre: item.name,
      slug: item.slug,
      descripcion: item.summary,
      especialidad: item.especialidad,
      especialidadNombre: especialidadBySlug(item.especialidad)?.name ?? item.especialidad,
      necesidades: item.needs,
      necesidadNombres: item.needs.map((id) => needById(id)?.name ?? id),
      zonas: item.zones,
      zonaNombres: item.zones.map((id) => zoneById(id)?.name ?? id),
      imagen: treatmentCardImage(item.slug),
      precio: money.precio,
      moneda: "COP",
      precioPromocional: money.precioPromocional,
      requiereValoracion: terms.requiereValoracion,
      disponibleOnline: terms.disponibleOnline,
      tipoPrecio: terms.tipoPrecio,
      sedes: sedeSlugs,
    };
  });
}

export function asCatalogItem(product: CommerceProduct): CatalogItem {
  return {
    slug: product.slug,
    name: product.nombre,
    status: "VERIFIED",
    especialidad: product.especialidad,
    zones: product.zonas,
    needs: product.necesidades,
    summary: `${product.descripcion} ${product.especialidadNombre} ${product.necesidadNombres.join(" ")} ${product.zonaNombres.join(" ")}`,
  };
}
