import type { ReviewState } from "@/data/guides";

export function MedicalReviewMark({ state }: { state: ReviewState }) {
  const label = state === "aprobado" ? "Contenido revisado médicamente" : "Revisión médica pendiente";
  return (
    <span className="review-mark" tabIndex={0} aria-label={label}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4 19v-2a4 4 0 0 1 4-4h3m-5-6a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" strokeLinecap="round" />
        <path d="M16 12v8m-4-4h8" strokeLinecap="round" />
      </svg>
      <span className="review-mark-label" aria-hidden="true">{label}</span>
    </span>
  );
}
