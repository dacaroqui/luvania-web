import { treatments } from "@/data";
import { sedes } from "@/data/sedes";
import { site, legalDocs } from "@/data/site";
import { especialidades } from "@/data/taxonomy";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "",
    "/tratamientos",
    "/promociones",
    "/sedes",
    "/franquicias",
    "/pqrs",
    "/experiencias",
    ...sedes.map((sede) => `/sedes/${sede.slug}`),
    ...especialidades.map((item) => `/especialidades/${item.slug}`),
    ...treatments.map((treatment) => `/tratamientos/${treatment.slug}`),
    ...legalDocs.map((doc) => doc.href),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/tratamientos/") ? 0.8 : 0.6,
  }));
}
