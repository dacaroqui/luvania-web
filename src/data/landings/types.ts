export type LandingChoice = { id: string; label: string };

export type LandingQuestion = {
  id: string;
  prompt: string;
  choices: LandingChoice[];
};

export type Landing = {
  slug: string;
  needId: string;
  treatmentSlug: string;
  title: string;
  description: string;
  questions: LandingQuestion[];
};

export type ExtraNeed = {
  id: string;
  name: string;
  text: string;
  treatments: string[];
  questions: LandingQuestion[];
};
