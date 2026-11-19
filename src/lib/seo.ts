import { site } from "@/data/site";
import type { Metadata } from "next";

const META_CLOSERS = [
  " La valoración es en las sedes de Luvania, en Bogotá.",
  " El equipo confirma el plan en la cita de valoración.",
  " El plan se confirma en la cita.",
  " Cita presencial en Bogotá.",
  " Cita en Bogotá.",
];

export function clampMeta(text: string) {
  let value = text.replace(/\s+/g, " ").trim();
  const used = new Set<string>();
  while (value.length < 140) {
    const room = 160 - value.length;
    const fit = META_CLOSERS.filter((sentence) => !used.has(sentence) && sentence.length <= room).sort(
      (a, b) => b.length - a.length,
    )[0];
    if (!fit) break;
    used.add(fit);
    value = `${value}${fit}`.replace(/\s+/g, " ").trim();
  }
  if (value.length > 160) {
    const cut = value.slice(0, 157);
    const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
    if (sentence >= 139) value = cut.slice(0, sentence + 1).trim();
    else {
      const space = cut.lastIndexOf(" ");
      value = (space >= 140 ? cut.slice(0, space) : cut).replace(/[\s,;:]+$/, "");
      if (!/[.!?]$/.test(value)) value = `${value}.`;
    }
  }
  if (value.length > 160) value = `${value.slice(0, 159).replace(/[\s,;:]+$/, "")}.`;
  return value;
}

export function pageMeta(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  index?: boolean;
}): Metadata {
  const url = `${site.url}${input.path}`;
  const image = input.image ?? "/images/og-luvania.jpg";
  const imageAlt = input.imageAlt ?? "Ambiente de Luvania, clínica estética en Bogotá";
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical: url },
    robots: input.index === false ? { index: false, follow: true } : undefined,
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [{ url: image, width: 1200, height: 675, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}
