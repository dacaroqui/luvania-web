import type { Treatment } from "@/data/types";
import { publicText } from "./public-copy";
import { clampMeta } from "./seo";

const titles: Record<string, string> = {
  acne: "Tratamiento del acné en Bogotá | Luvania",
  "eliminar-ojeras": "Ojeras: valoración en Bogotá | Luvania",
  celulitis: "Celulitis: protocolo en Bogotá | Luvania",
  "hair-loss": "Caída del cabello: protocolo | Luvania",
  manchas: "Manchas en la piel, Bogotá | Luvania",
};

export function treatmentSeo(treatment: Treatment) {
  const title = titles[treatment.slug] ?? `${treatment.name} en Bogotá | Luvania`;
  const lead =
    publicText(treatment.status === "VERIFIED" ? treatment.summary : treatment.neutralSummary, treatment.name) ||
    treatment.name;
  const description = clampMeta(`${treatment.name} en Luvania, Bogotá. ${lead}`);
  return { title, description };
}
