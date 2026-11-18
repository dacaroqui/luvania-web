import type { Treatment } from "./types";
import raw from "./treatments.json";

export const treatments = raw as Treatment[];

const bySlug = new Map(treatments.map((treatment) => [treatment.slug, treatment]));

export function getTreatment(slug: string) {
  return bySlug.get(slug);
}

export function relatedTreatments(treatment: Treatment) {
  return treatment.related
    .map((slug) => bySlug.get(slug))
    .filter((item): item is Treatment => Boolean(item));
}

export const auditSlugsPresent = treatments.filter((treatment) => treatment.inAudit44).length;
