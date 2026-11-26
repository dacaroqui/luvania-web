import { guides as existingGuides } from "./batch";
import { facialContourGuides } from "./contorno-facial";
import type { Guide } from "./types";

export type { Guide, GuideBlock, ReviewState } from "./types";

const guides = [...facialContourGuides, ...existingGuides];
const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));

export function getGuide(slug: string) {
  return bySlug.get(slug);
}

export function allGuides(): Guide[] {
  return guides;
}

export function readingMinutes(guide: Guide) {
  const words = [
    ...guide.blocks.flatMap((block) => [...block.paragraphs, block.figure?.caption ?? ""]),
    ...guide.faqs.flatMap((faq) => [faq.q, faq.a]),
    ...guide.references.map((source) => source.title),
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(4, Math.round(words / 200));
}
