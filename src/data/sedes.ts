import type { Sede } from "./types";

export const sedes: Sede[] = [
  {
    slug: "restrepo",
    name: "Restrepo",
    neighborhood: "Restrepo",
    address: "Cra. 24 #15-19",
    addressNote:
      "En el formulario del sitio anterior la dirección aparece como Cra. 24 #15-19 Sur. En la ficha de la sede, sin «Sur».",
    phoneDisplay: "(601) 749 8903",
    phoneTel: "+576017498903",
    whatsapp: "573245513680",
    whatsappNote:
      "La tarjeta de la home usa WhatsApp 324 551 3680. La ficha de la sede muestra también el móvil 324 463 7977. Se usa el de la tarjeta, que la auditoría asigna a esta sede.",
    hours: [
      { days: "Lunes, martes, jueves y viernes", hours: "10:00 a. m. – 7:00 p. m." },
      { days: "Miércoles y sábados", hours: "8:00 a. m. – 5:00 p. m." },
      { days: "Domingos", hours: "Cerrado" },
    ],
    mapsUrl:
      "https://www.google.com/maps/place/Luvania+Sede+Restrepo/@4.5879149,-74.1011699,17z",
    geo: { lat: 4.5879149, lng: -74.1011699 },
    todo: [
      "Unificar dirección: ¿lleva «Sur»?",
      "Confirmar si el WhatsApp de citas es 324 551 3680 o el móvil de la ficha 324 463 7977.",
      "Publicar habilitación y cómo llegar (parqueadero, referencia).",
    ],
  },
  {
    slug: "modelia",
    name: "Modelia",
    neighborhood: "Modelia",
    address: "Cl. 24 #74a-37",
    phoneDisplay: "(601) 312 8000",
    phoneTel: "+576013128000",
    whatsapp: "573052526574",
    whatsappNote:
      "WhatsApp de la tarjeta: 305 252 6574. La ficha de la sede muestra el móvil 324 551 6271. El fijo 312 8000 también aparece en la ficha huérfana de Galerías.",
    hours: [
      { days: "Lunes, jueves y viernes", hours: "10:30 a. m. – 7:30 p. m." },
      { days: "Martes", hours: "10:00 a. m. – 7:00 p. m." },
      { days: "Miércoles", hours: "8:00 a. m. – 5:00 p. m." },
      { days: "Sábados", hours: "TODO: la ficha no publica el sábado" },
      { days: "Domingos", hours: "Cerrado" },
    ],
    hoursNote: "El sábado no estaba en el bloque de horario de la sede.",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Luvania+Modelia+Calle+24+74a-37+Bogota",
    todo: [
      "Confirmar el sábado.",
      "Elegir un solo WhatsApp: 305 252 6574 (tarjeta) o 324 551 6271 (ficha).",
      "El fijo 312 8000 está repetido en Galerías. Confirmar cuál sede lo usa.",
      "Falta coordenada verificada del mapa.",
    ],
  },
  {
    slug: "chico",
    name: "Chicó",
    neighborhood: "Chicó",
    address: "Cra. 15 #106-47",
    phoneDisplay: "(601) 621 0490",
    phoneTel: "+576016210490",
    whatsapp: "573118322100",
    whatsappNote:
      "WhatsApp de la tarjeta: 311 832 2100. La ficha muestra el móvil 315 585 7785.",
    hours: [
      { days: "Lunes, martes, jueves y viernes", hours: "10:00 a. m. – 7:00 p. m." },
      { days: "Miércoles y sábados", hours: "8:00 a. m. – 5:00 p. m." },
      { days: "Domingos", hours: "Cerrado" },
    ],
    mapsUrl:
      "https://www.google.com/maps/place/LUVANIA+Sede+Chico+Norte/@4.690749,-74.045616,17z",
    geo: { lat: 4.690749, lng: -74.045616 },
    todo: [
      "Unificar WhatsApp 311 832 2100 con el móvil de la ficha 315 585 7785.",
      "El slug histórico es /chico, sin tilde. La marca visible es Chicó.",
    ],
  },
  {
    slug: "venecia",
    name: "Venecia",
    neighborhood: "Venecia",
    address: "Dg. 46a Sur #53-50",
    phoneDisplay: "TODO: la sede no tiene teléfono publicado",
    whatsapp: "573044196129",
    whatsappNote:
      "La tarjeta de la home enlaza WhatsApp 304 419 6129. La página /venecia del sitio anterior respondía 404, así que no hay fijo verificado.",
    hours: [
      { days: "Lunes a viernes", hours: "TODO: confirmar. El pie global dice 8:00 a. m. – 5:00 p. m." },
      { days: "Sábados", hours: "TODO: el pie global dice 8:00 a. m. – 3:00 p. m." },
      { days: "Domingos", hours: "Cerrado" },
    ],
    hoursNote: "No había página de sede. El horario de abajo es el del pie global, no el de Venecia.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Diagonal+46a+Sur+53-50+Bogota",
    todo: [
      "Publicar teléfono fijo y horario propio.",
      "Confirmar que la dirección Dg. 46a Sur #53-50 sigue vigente.",
      "Confirmar mapa y punto de referencia.",
      "La página anterior estaba rota (404) aunque la tarjeta de la home la enlazaba.",
    ],
  },
  {
    slug: "colina",
    name: "Colina",
    neighborhood: "Colina",
    address: "Cra. 58 #128b-34",
    phoneDisplay: "311 678 1583",
    phoneTel: "+573116781583",
    whatsapp: "573116781583",
    whatsappNote: "El móvil de la ficha y el WhatsApp de la tarjeta coinciden.",
    hours: [
      { days: "Lunes a viernes", hours: "10:30 a. m. – 7:30 p. m." },
      { days: "Sábados", hours: "8:00 a. m. – 5:00 p. m." },
      { days: "Domingos", hours: "TODO: la ficha no dice el domingo" },
    ],
    hoursNote:
      "La web anterior escribía el sábado como «80:00 am». Se interpreta como 8:00 a. m.",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Luvania+Sede+Colina+Cra+58+128b-34+Bogota",
    todo: [
      "Confirmar el domingo y la errata 80:00.",
      "Publicar coordenada del mapa. El enlace antiguo de Google no trae latitud legible.",
      "No hay fijo distinto del móvil.",
    ],
  },
];

export function getSede(slug: string) {
  return sedes.find((sede) => sede.slug === slug);
}
