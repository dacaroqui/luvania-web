export const site = {
  name: "Luvania",
  legalName: "Luvania Innovación Estética",
  url: "https://luvania.com",
  description:
    "Clínica estética en Bogotá. Tratamientos faciales y corporales en cinco sedes. Agenda tu valoración.",
  email: "servicioalcliente@luvania.com",
  phoneDisplay: "(601) 744 8989 ext. 601",
  phoneTel: "+576017448989",
  mobileDisplay: "305 815 4513",
  mobileTel: "+573058154513",
  franchiseWhatsapp: "573197837774",
  brandOf: "CIFES",
  locale: "es_CO",
} as const;

export const legalDocs = [
  {
    slug: "datos",
    href: "/politicas/datos-personales",
    title: "Tratamiento de datos personales",
    pdf: "https://luvania.com/politica-de-privacidad-luvania.pdf",
    pdfLabel: "politica-de-privacidad-luvania.pdf",
  },
  {
    slug: "cambios",
    href: "/politicas/cambios-y-devoluciones",
    title: "Cambios y devoluciones",
    pdf: "https://luvania.com/POLITICA-DE-CAMBIO-LUVANIA.pdf",
    pdfLabel: "POLITICA-DE-CAMBIO-LUVANIA.pdf",
  },
] as const;

/** Lo que el cliente debe entregar. También vive junto a cada sede. */
export const clientTodos = [
  "Vigencia real de las 18 ofertas (precios del 17 de noviembre de 2026) y corrección del precio tachado de pómulos.",
  "Confirmar si la pieza de marca «Lipo sin cirugía» corresponde a la lipólisis de diodo láser.",
  "Lista oficial de fórmulas de sueroterapia y el médico que las indica.",
  "Protocolo escrito de Porcelanización, Proface, Lipomax, Velanova, Dercelu, Autosanguis y Shock Therapy Bronce.",
  "Decidir si se ofrecen, y en qué sedes: cavitación, criolipólisis, CO₂ fraccionado, depilación láser, eliminación de tatuajes, estrías, cicatrices, bruxismo y várices.",
  "Retirar o justificar el filtro antiguo de depresión, ansiedad y gastritis: no se publican como servicios.",
  "Número de habilitación de cada sede, nombres del equipo médico, tarjetas profesionales y fotos con autorización.",
  "Tabla de financiación sin intereses: plazos, aliado y condiciones.",
  "Testimonios con nombre, sede, tratamiento, fecha y permiso de publicación.",
  "Fotos propias de sedes y de zonas (el retrato del inicio es un marcador de posición).",
  "Teléfonos unificados por sede (ver TODOs en cada ficha) y horario de Venecia.",
  "Definir si Galerías sigue abierta. No está entre las cinco sedes activas. Cedritos no se incluye.",
  "Promo 2x1 de Collagen Therapy mostrada en la guía de marca y ausente en la web.",
  "Precio y presentaciones del ácido hialurónico.",
] as const;
