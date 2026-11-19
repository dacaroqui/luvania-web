import { getTreatment } from "@/data";
import { allGuides, type Guide } from "@/data/guides";
import type { Treatment } from "@/data/types";
import { clinicalVisible } from "@/lib/review";

export type GuideMatch = { guide: Guide; treatment: Treatment; score: number };

/** Guías publicadas (en producción, solo las aprobadas) que comparten zona, necesidad o especialidad. */
export function relatedGuides(
  treatment: Pick<Treatment, "slug" | "especialidad" | "zones" | "needs">,
  limit = 3,
): GuideMatch[] {
  const matches: GuideMatch[] = [];
  for (const guide of allGuides()) {
    if (guide.slug === treatment.slug || !clinicalVisible(guide.medicalReview)) continue;
    const other = getTreatment(guide.slug);
    if (!other) continue;
    const zones = other.zones.filter((zone) => treatment.zones.includes(zone)).length;
    const needs = other.needs.filter((need) => treatment.needs.includes(need)).length;
    const spec = other.especialidad === treatment.especialidad ? 1 : 0;
    const score = spec * 4 + zones * 2 + needs;
    if (score === 0) continue;
    matches.push({ guide, treatment: other, score });
  }
  matches.sort((a, b) => b.score - a.score || a.guide.h1.localeCompare(b.guide.h1, "es"));
  return matches.slice(0, limit);
}

export function guideSentence(name: string) {
  const lower = name.charAt(0).toLocaleLowerCase("es") + name.slice(1);
  return `Lee la guía completa de ${lower}`;
}
