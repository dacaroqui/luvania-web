import { site } from "@/data/site";
import type { Metadata } from "next";

export function clampMeta(text: string) {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length <= 160) return value;
  const cut = value.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.]+$/, "")}…`;
}

export function pageMeta(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  index?: boolean;
}): Metadata {
  const url = `${site.url}${input.path}`;
  const image = input.image ?? "/images/og-luvania.jpg";
  const imageAlt = input.imageAlt ?? "Ambiente de Luvania, clínica estética en Bogotá";
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical: url },
    robots: input.index === false || process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: true }
      : undefined,
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: input.type ?? "website",
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
