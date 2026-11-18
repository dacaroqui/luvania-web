import { site } from "@/data/site";
import type { Metadata } from "next";

export function pageMeta(input: { title: string; description: string; path: string }): Metadata {
  const url = `${site.url}${input.path}`;
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [
        {
          url: "/images/og-luvania.jpg",
          width: 1200,
          height: 675,
          alt: "Ambiente de Luvania, clínica estética en Bogotá",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: ["/images/og-luvania.jpg"],
    },
  };
}
