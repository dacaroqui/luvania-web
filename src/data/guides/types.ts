export type ReviewState = "pendiente" | "aprobado";

export type GuideBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  /** Resumen de la tarjeta en la ficha. Vacío si esa sección no sale en la ficha. */
  card?: string;
};

export type GuideFaq = { q: string; a: string };

export type Guide = {
  slug: string;
  h1: string;
  title: string;
  description: string;
  keyword: string;
  secondary: string[];
  medicalReview: ReviewState;
  revisadoPor: string | null;
  fechaRevision: string | null;
  blocks: GuideBlock[];
  faqs: GuideFaq[];
};
