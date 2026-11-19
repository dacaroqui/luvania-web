export type ReviewState = "pendiente" | "aprobado";

export type GuideFigureKind = "union" | "foliculo" | "parpado" | "labio" | "septos" | "gluteo" | "ciclo";

export type GuideFigure = {
  kind: GuideFigureKind;
  alt: string;
  caption: string;
};

export type GuideSource = {
  title: string;
  publisher: string;
  href: string;
};

export type GuideBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  /** Resumen de la tarjeta en la ficha. Vacío si esa sección no sale en la ficha. */
  card?: string;
  figure?: GuideFigure;
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
  references: GuideSource[];
};
