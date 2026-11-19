import type { LandingQuestion } from "./types";

/** Preguntas de otras necesidades ya publicadas. No repiten nombre ni teléfono. */
export const extraQuestions: Record<string, LandingQuestion[]> = {
  arrugas: [
    {
      id: "donde",
      prompt: "¿Dónde notas las líneas?",
      choices: [
        { id: "frente", label: "Frente" },
        { id: "entrecejo", label: "Entrecejo" },
        { id: "patas", label: "Patas de gallo" },
        { id: "cuello", label: "Cuello" },
        { id: "no-se", label: "No lo tengo claro" },
      ],
    },
    {
      id: "gesto",
      prompt: "¿Aparecen al gesticular o también en reposo?",
      choices: [
        { id: "gesto", label: "Al gesticular" },
        { id: "reposo", label: "También en reposo" },
        { id: "no-se", label: "No lo distingo" },
      ],
    },
  ],
  flacidez: [
    {
      id: "zona",
      prompt: "¿En qué zona la notas?",
      choices: [
        { id: "rostro", label: "Rostro" },
        { id: "cuello", label: "Cuello" },
        { id: "cuerpo", label: "Cuerpo" },
        { id: "varias", label: "Varias" },
      ],
    },
  ],
  acne: [
    {
      id: "como",
      prompt: "¿Cómo lo describes?",
      choices: [
        { id: "brotes", label: "Brotes" },
        { id: "marcas", label: "Marcas" },
        { id: "ambos", label: "Brotes y marcas" },
        { id: "no-se", label: "No lo sé" },
      ],
    },
  ],
  manchas: [
    {
      id: "donde",
      prompt: "¿Dónde las ves?",
      choices: [
        { id: "rostro", label: "Rostro" },
        { id: "manos", label: "Manos" },
        { id: "cuerpo", label: "Cuerpo" },
        { id: "varias", label: "Varias" },
      ],
    },
  ],
  ojeras: [
    {
      id: "que",
      prompt: "¿Qué te llama la atención bajo el ojo?",
      choices: [
        { id: "color", label: "El color" },
        { id: "surco", label: "El surco" },
        { id: "ambos", label: "Color y surco" },
        { id: "no-se", label: "No lo sé" },
      ],
    },
  ],
  "grasa-localizada": [
    {
      id: "zona",
      prompt: "¿Qué zona quieres mirar?",
      choices: [
        { id: "abdomen", label: "Abdomen" },
        { id: "caderas", label: "Caderas" },
        { id: "brazos", label: "Brazos" },
        { id: "piernas", label: "Piernas" },
        { id: "otra", label: "Otra" },
      ],
    },
  ],
  celulitis: [
    {
      id: "donde",
      prompt: "¿Dónde la notas?",
      choices: [
        { id: "muslos", label: "Muslos" },
        { id: "gluteos", label: "Glúteos" },
        { id: "abdomen", label: "Abdomen" },
        { id: "varias", label: "Varias" },
      ],
    },
  ],
  sudoracion: [
    {
      id: "donde",
      prompt: "¿Dónde te estorba?",
      choices: [
        { id: "axilas", label: "Axilas" },
        { id: "manos", label: "Manos" },
        { id: "pies", label: "Pies" },
        { id: "rostro", label: "Rostro" },
        { id: "varias", label: "Varias" },
      ],
    },
  ],
};
