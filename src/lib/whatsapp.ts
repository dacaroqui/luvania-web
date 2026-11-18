import { site } from "@/data/site";
import { agendaMessage } from "./agenda-message";
import { waLink } from "./format";

export function agendaLink(input: { sede: string; whatsapp: string; tratamiento: string; url: string }) {
  return waLink(input.whatsapp, agendaMessage(input));
}

export function franchiseLink() {
  return waLink(
    site.franchiseWhatsapp,
    "Hola, quiero información sobre franquicias Luvania. ¿Me cuentan requisitos y sedes disponibles?",
  );
}
