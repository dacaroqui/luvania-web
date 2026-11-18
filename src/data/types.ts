export type ZoneId =
  | "rostro"
  | "cuello"
  | "abdomen"
  | "piernas"
  | "brazos"
  | "gluteos"
  | "capilar"
  | "intima"
  | "manos"
  | "corporal";

export type NeedId =
  | "manchas"
  | "flacidez"
  | "grasa-localizada"
  | "arrugas"
  | "lineas-de-expresion"
  | "acne"
  | "ojeras"
  | "celulitis"
  | "volumen"
  | "caida-cabello"
  | "sudoracion"
  | "hidratacion"
  | "papada"
  | "tonicidad"
  | "rejuvenecimiento"
  | "cicatrices"
  | "estrias"
  | "bienestar"
  | "contorno";

export interface Faq {
  q: string;
  a: string;
}

export interface Treatment {
  slug: string;
  name: string;
  especialidad: string;
  zones: ZoneId[];
  needs: NeedId[];
  summary: string;
  queEs: string;
  beneficios: string[];
  paraQuien: string;
  sesiones: string;
  duracion: string;
  faqs: Faq[];
  related: string[];
  /** Texto redactado porque la página de origen no existía, estaba vacía o era un borrador. */
  placeholder: boolean;
  placeholderNote?: string;
  /** Pertenece a las 44 páginas de tratamiento del inventario (incluye la página basura "x", que no se publica). */
  inAudit44: boolean;
}

export interface Offer {
  slug: string;
  name: string;
  treatmentSlug: string;
  priceBefore: number;
  priceNow: number;
  /** El sitio anterior rotulaba todas como -30%. Aquí mostramos el descuento real. */
  labelOnOldSite: string;
  priceBeforeSuspicious?: boolean;
  note?: string;
}

export interface Sede {
  slug: string;
  name: string;
  neighborhood: string;
  address: string;
  addressNote?: string;
  /** Teléfono publicado en la página de la sede. */
  phoneDisplay: string;
  phoneTel?: string;
  /** WhatsApp de la tarjeta de la home, según la auditoría. */
  whatsapp: string;
  whatsappNote?: string;
  hours: { days: string; hours: string }[];
  hoursNote?: string;
  mapsUrl?: string;
  geo?: { lat: number; lng: number };
  todo: string[];
}

export interface Testimonial {
  name: string;
  quote: string;
  treatment: string;
  sede: string;
  placeholder: true;
}
