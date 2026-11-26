import { getTreatment } from "./index";

// These stock files duplicate a photo used by another treatment card.
const repeatedStock = new Set([
  "acne",
  "aumento-y-o-perfilamiento-de-menton",
  "autosanguis",
  "biorevitalizacion",
  "bolsas-en-los-ojos",
  "collagen-therapy",
  "corrientes-rusas",
  "cromoterapia",
  "dercelu",
  "detox-reductor",
  "detox-therapy",
  "detoxificacion",
  "diatermia",
  "electroplasma",
  "electroporacion",
  "ems-garden-sculpt",
  "factores-de-crecimiento",
  "hidrolipoclasia",
  "hidroxiapatita-de-calcio",
  "levantamiento-de-gluteos",
  "lifting-facial",
  "lipolisis-de-diodo-laser",
  "lipomax",
  "liporeductor",
  "moldeo-corporal",
  "plasma-virtual",
  "proface",
  "rejuvenecimiento-vaginal",
  "rinomodelacion",
  "shock-therapy-bronce",
  "toxina-botulinica-tipo-a",
  "velanova",
]);

const editorialImages: Record<string, string> = {
  "aumento-y-o-perfilamiento-de-menton": "/guias/perfil-mandibula-menton.webp",
};

export function treatmentCardImage(slug: string) {
  return editorialImages[slug] ?? (repeatedStock.has(slug) ? undefined : getTreatment(slug)?.image);
}
