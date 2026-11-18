import type { NeedId, ZoneId } from "./types";

export const especialidades = [
  {
    slug: "rejuvenecimiento-facial",
    name: "Rejuvenecimiento facial",
    description:
      "Protocolos para devolver luminosidad, textura y descanso al rostro sin prometer un resultado de quirófano.",
  },
  {
    slug: "obesidad-y-sobrepeso",
    name: "Contorno y grasa localizada",
    description:
      "Tratamientos para depósitos de grasa y medidas. No sustituyen un plan médico de peso ni una cirugía.",
  },
  {
    slug: "estetica-facial",
    name: "Estética facial",
    description:
      "Desde la limpieza y las manchas hasta toxina, hilos y perfilamiento. El grupo más amplio de la red.",
  },
  {
    slug: "estetica-corporal",
    name: "Estética corporal",
    description:
      "Firmeza, celulitis, glúteos, moldeo y bienestar íntimo, con valoración previa en sede.",
  },
  {
    slug: "nutricion-capilar",
    name: "Nutrición capilar",
    description:
      "Protocolos para la caída del cabello. El diagnóstico define si el camino es capilar, médico o ambos.",
  },
  {
    slug: "medicina-estetica",
    name: "Medicina estética",
    description:
      "Hiperhidrosis y sueroterapia: estaban publicadas y fuera del menú. Aquí tienen lugar propio.",
  },
] as const;

export type EspecialidadSlug = (typeof especialidades)[number]["slug"];

export const zones: { id: ZoneId; name: string; hint: string }[] = [
  { id: "rostro", name: "Rostro", hint: "Frente, mejillas, ojeras, labios" },
  { id: "cuello", name: "Cuello y papada", hint: "Mandíbula, papada, escote" },
  { id: "abdomen", name: "Abdomen", hint: "Cintura, flancos, abdomen" },
  { id: "piernas", name: "Piernas", hint: "Muslos, rodillas, pantorrillas" },
  { id: "brazos", name: "Brazos", hint: "Brazos y zona posterior" },
  { id: "gluteos", name: "Glúteos", hint: "Firmeza y contorno" },
  { id: "capilar", name: "Capilar", hint: "Cuero cabelludo y densidad" },
  { id: "intima", name: "Zona íntima", hint: "Bienestar íntimo" },
  { id: "manos", name: "Manos", hint: "Dorso de las manos" },
  { id: "corporal", name: "Cuerpo", hint: "Más de una zona" },
];

export const needs: { id: NeedId; name: string }[] = [
  { id: "manchas", name: "Manchas" },
  { id: "flacidez", name: "Flacidez" },
  { id: "grasa-localizada", name: "Grasa localizada" },
  { id: "arrugas", name: "Arrugas" },
  { id: "lineas-de-expresion", name: "Líneas de expresión" },
  { id: "acne", name: "Acné" },
  { id: "ojeras", name: "Ojeras y bolsas" },
  { id: "celulitis", name: "Celulitis" },
  { id: "volumen", name: "Volumen" },
  { id: "caida-cabello", name: "Caída del cabello" },
  { id: "sudoracion", name: "Sudoración" },
  { id: "hidratacion", name: "Hidratación" },
  { id: "papada", name: "Papada" },
  { id: "tonicidad", name: "Tonicidad" },
  { id: "rejuvenecimiento", name: "Rejuvenecimiento" },
  { id: "cicatrices", name: "Cicatrices" },
  { id: "estrias", name: "Estrías" },
  { id: "bienestar", name: "Bienestar" },
  { id: "contorno", name: "Contorno" },
];

export function especialidadBySlug(slug: string) {
  return especialidades.find((item) => item.slug === slug);
}

export function zoneById(id: string) {
  return zones.find((item) => item.id === id);
}

export function needById(id: string) {
  return needs.find((item) => item.id === id);
}
