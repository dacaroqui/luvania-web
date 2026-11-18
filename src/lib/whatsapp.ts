import { site } from "@/data/site";
import { waLink } from "./format";

export function bookingMessage(input: {
  nombre: string;
  telefono: string;
  sede: string;
  tratamiento?: string;
}) {
  const tratamiento = input.tratamiento?.trim() || "aún por definir";
  return `Hola, soy ${input.nombre.trim()}. Quiero agendar una valoración sin costo en la sede ${input.sede}. Mi teléfono es ${input.telefono.trim()}. Tratamiento de interés: ${tratamiento}.`;
}

export function bookingLink(input: {
  nombre: string;
  telefono: string;
  sede: string;
  whatsapp: string;
  tratamiento?: string;
}) {
  return waLink(input.whatsapp, bookingMessage(input));
}

export function franchiseLink() {
  return waLink(
    site.franchiseWhatsapp,
    "Hola, quiero información sobre franquicias Luvania. ¿Me cuentan requisitos y sedes disponibles?",
  );
}
