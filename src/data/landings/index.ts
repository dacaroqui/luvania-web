import { forNeed, needPages } from "@/lib/hubs";
import caida from "./caida-del-cabello";
import promociones from "./promociones";
import { extraQuestions } from "./extra-needs";
import type { ExtraNeed, Landing } from "./types";

const landings = [caida, promociones];

export function allLandings(): Landing[] {
  return landings;
}

export function getLanding(slug: string) {
  return landings.find((item) => item.slug === slug);
}

export function extraNeedsFor(needId: string): ExtraNeed[] {
  return needPages.flatMap((need) => {
    if (need.slug === needId) return [];
    const questions = extraQuestions[need.slug];
    const treatments = forNeed(need.slug);
    if (treatments.length === 0) return [];
    if (!questions && need.slug !== "caida-cabello") return [];
    return [
      {
        id: need.slug,
        name: need.name,
        text: need.text,
        treatments: treatments.slice(0, 3).map((item) => item.name),
        questions: questions ?? [],
      },
    ];
  });
}
