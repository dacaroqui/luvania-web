import { catalog } from "@/data/catalog";
import type { CatalogItem } from "@/data/types";

const body = new Set(["abdomen", "piernas", "brazos", "gluteos", "corporal", "intima"]);

export const zonePages = [
  { slug: "rostro", name: "Rostro", text: "Tratamientos del rostro publicados en Luvania." },
  { slug: "ojos", name: "Ojos", text: "Ojeras, bolsas y la mirada." },
  { slug: "labios", name: "Labios", text: "Perfil y volumen de labios." },
  { slug: "piel", name: "Piel", text: "Textura, manchas, acné y luminosidad de la piel." },
  { slug: "cuerpo", name: "Cuerpo", text: "Abdomen, piernas, brazos, glúteos y contorno." },
  { slug: "cuello", name: "Cuello y papada", text: "Mandíbula, papada y cuello." },
  { slug: "abdomen", name: "Abdomen", text: "Cintura y abdomen." },
  { slug: "piernas", name: "Piernas", text: "Muslos y piernas." },
  { slug: "brazos", name: "Brazos", text: "Brazos." },
  { slug: "gluteos", name: "Glúteos", text: "Firmeza y forma." },
  { slug: "capilar", name: "Capilar", text: "Cuero cabelludo y densidad." },
  { slug: "intima", name: "Zona íntima", text: "Bienestar íntimo." },
  { slug: "manos", name: "Manos", text: "Dorso de las manos." },
];

export const needPages = [
  { slug: "arrugas", name: "Arrugas", text: "Líneas de movimiento y arrugas." },
  { slug: "flacidez", name: "Flacidez", text: "Piel que perdió firmeza." },
  { slug: "acne", name: "Acné", text: "Brotes leves y la marca que dejan." },
  { slug: "manchas", name: "Manchas", text: "Tono irregular y manchas." },
  { slug: "ojeras", name: "Ojeras", text: "Color y surco bajo el ojo." },
  { slug: "grasa-localizada", name: "Grasa localizada", text: "Depósitos, no un plan de peso." },
  { slug: "celulitis", name: "Celulitis", text: "Textura de la piel." },
  { slug: "caida-cabello", name: "Caída del cabello", text: "Densidad y cuero cabelludo." },
  { slug: "sudoracion", name: "Sudoración excesiva", text: "Hiperhidrosis." },
];

function verified(item: CatalogItem) {
  return item.status === "VERIFIED";
}

export function forZone(slug: string) {
  return catalog.filter((item) => {
    if (!verified(item)) return false;
    if (slug === "ojos") return item.needs.includes("ojeras") || /ojera|bolsa/.test(item.slug);
    if (slug === "labios") return item.slug.includes("labios");
    if (slug === "piel") {
      if (item.slug.includes("labios")) return false;
      const skin = new Set(["manchas", "acne", "hidratacion", "cicatrices", "flacidez", "rejuvenecimiento", "estrias", "tonicidad"]);
      return item.needs.some((need) => skin.has(need));
    }
    if (slug === "cuerpo") return item.zones.some((zone) => body.has(zone));
    return item.zones.includes(slug);
  });
}

export function forNeed(slug: string) {
  return catalog.filter((item) => verified(item) && item.needs.includes(slug));
}
