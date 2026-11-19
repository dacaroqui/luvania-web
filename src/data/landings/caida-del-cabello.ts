import type { Landing } from "./types";

const landing: Landing = {
  slug: "caida-del-cabello",
  needId: "caida-cabello",
  treatmentSlug: "hair-loss",
  title: "Caída del cabello: valoración | Luvania",
  description: "Valoración de la caída del cabello en Luvania. El plan se confirma en la cita, sin un plazo prometido.",
  questions: [
    {
      id: "desde-cuando",
      prompt: "¿Hace cuánto empezaste a notar esta necesidad?",
      choices: [
        { id: "semanas", label: "Hace unas semanas" },
        { id: "meses", label: "Unos meses" },
        { id: "ano", label: "Más de un año" },
        { id: "no-se", label: "No estoy segura" },
      ],
    },
    {
      id: "zona",
      prompt: "¿En qué zona específica te gustaría enfocarte?",
      choices: [
        { id: "entradas", label: "Entradas" },
        { id: "coronilla", label: "Coronilla" },
        { id: "raya", label: "Raya" },
        { id: "parches", label: "Parches" },
        { id: "todo", label: "Todo el cuero" },
      ],
    },
    {
      id: "probado",
      prompt: "¿Qué cambios has probado y cómo te fue?",
      choices: [
        { id: "topico", label: "Champú o tónico" },
        { id: "suplemento", label: "Suplementos" },
        { id: "cabina", label: "Otro tratamiento en cabina" },
        { id: "nada", label: "Nada todavía" },
      ],
    },
    {
      id: "satisfecha",
      prompt: "¿Con qué cambio te sentirías satisfecha?",
      choices: [
        { id: "causa", label: "Entender la causa" },
        { id: "caida", label: "Mirar la caída que noto" },
        { id: "cuero", label: "Cuidar el cuero cabelludo" },
        { id: "no-se", label: "Aún no lo sé" },
      ],
    },
    {
      id: "cuando",
      prompt: "¿Cuándo te gustaría empezar?",
      choices: [
        { id: "semana", label: "Esta semana, urge" },
        { id: "mes", label: "El próximo mes" },
        { id: "tres", label: "En los próximos 3 meses" },
      ],
    },
    {
      id: "decision",
      prompt: "¿Qué te ayudaría a tomar una decisión?",
      choices: [
        { id: "precio", label: "Ver el precio" },
        { id: "sede", label: "Saber la sede y el horario" },
        { id: "valoracion", label: "Una valoración sin compromiso" },
        { id: "hablar", label: "Hablar con alguien" },
      ],
    },
  ],
};

export default landing;
