import { catalog } from "@/data/catalog";
import { resolveSedes } from "@/data/sedes";
import { legalDocs, site } from "@/data/site";
import { especialidades } from "@/data/taxonomy";
import { needPages, zonePages } from "@/lib/hubs";
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
    "/recorridos/caida-del-cabello",
    "/recorridos/abdomen",
    ...resolveSedes().map((sede) => `/sedes/${sede.slug}`),
    ...especialidades.map((item) => `/especialidades/${item.slug}`),
    ...zonePages.map((zone) => `/zonas/${zone.slug}`),
    ...needPages.map((need) => `/necesidades/${need.slug}`),
    ...catalog.filter((item) => item.status === "VERIFIED").map((item) => `/tratamientos/${item.slug}`),
    ...legalDocs.map((doc) => doc.href),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/tratamientos/") ? 0.8 : 0.6,
  }));
}