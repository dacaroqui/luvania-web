export type LandingChoice = { id: string; label: string };

export type LandingQuestion = {
  id: string;
  prompt: string;
  choices: LandingChoice[];
};

export type Landing = {
  slug: string;
  needId: string;
  treatmentSlug?: string;
  title: string;
  description: string;
  heroKicker: string;
  heroTitle: string;
  heroIntro?: string;
  /** `related` usa el tratamiento y sus relacionados. `all` usa las ofertas publicadas. */
  promoFilter: "related" | "all";
  /** Activa la experiencia capilar y su comparador de ejemplo. */
  simulation: boolean;
  /** Permite pausar la vista personal sin ocultar el comparador. */
  showPersonalSimulation?: boolean;
  showResults: boolean;
  showDoctor: boolean;
  questions: LandingQuestion[];
};

export type ExtraNeed = {
  id: string;
  name: string;
  text: string;
  treatments: string[];
  questions: LandingQuestion[];
};
