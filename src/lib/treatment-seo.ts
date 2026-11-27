import type { Treatment } from "@/data/types";
import { publicText } from "./public-copy";
import { clampMeta } from "./seo";

const titles: Record<string, string> = {
  acne: "Tratamiento del acné en Bogotá | Luvania",
  "eliminar-ojeras": "Ojeras: valoración en Bogotá | Luvania",
  celulitis: "Celulitis: protocolo en Bogotá | Luvania",
  "hair-loss": "Valoración para la caída del cabello en Bogotá | Luvania",
  "perfilamiento-maxilar-hombres": "Perfilamiento mandibular y maxilar en Bogotá | Luvania",
  "toxina-botulinica-tipo-a": "Toxina botulínica tipo A en Bogotá | Luvania",
  "aumento-y-o-perfilamiento-de-labios": "Perfilamiento de labios en Bogotá | Luvania",
  manchas: "Manchas en la piel, Bogotá | Luvania",
};

const descriptions: Record<string, string> = {
  "hair-loss": "¿Notas más entradas o menos densidad? Consulta qué aborda la ficha de caída del cabello y cómo solicitar una valoración capilar en Luvania, Bogotá.",
  "perfilamiento-maxilar-hombres": "Conoce qué es el perfilamiento mandibular, qué zonas del contorno trata y qué preguntar antes de solicitar una valoración en Luvania, Bogotá.",
};

export function treatmentSeo(treatment: Treatment) {
  const title = titles[treatment.slug] ?? `${treatment.name} en Bogotá | Luvania`;
  const lead =
    publicText(treatment.status === "VERIFIED" ? treatment.summary : treatment.neutralSummary, treatment.name) ||
    treatment.name;
  const description = descriptions[treatment.slug] ?? clampMeta(`${lead} Consulta la ficha y las opciones de valoración en Luvania, Bogotá.`);
  return { title, description };
}
