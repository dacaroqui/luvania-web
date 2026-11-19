import type { ReviewState } from "@/data/guides/types";

/** En producción, lo pendiente no se publica. En preview y en local, sí, con aviso y sin indexar. */
export function clinicalVisible(state: ReviewState) {
  return state === "aprobado" || process.env.VERCEL_ENV !== "production";
}

export function guideIndexable(state: ReviewState) {
  return state === "aprobado" && process.env.VERCEL_ENV === "production";
}
