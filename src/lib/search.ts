import type { CatalogItem, ZoneId } from "@/data/types";
import { zoneById } from "@/data/taxonomy";

export const searchAliases: { keys: string[]; slug: string }[] = [
  { keys: ["hidroxipatita", "hidroxiapatita"], slug: "hidroxiapatita-de-calcio" },
  { keys: ["hair loss", "caida del cabello", "caída del cabello", "perdida de cabello", "pérdida de cabello"], slug: "hair-loss" },
  { keys: ["dewlap", "papada"], slug: "dewlap-lipopapada-sin-cirugia" },
  { keys: ["lipo sin cirugia", "lipo sin cirugía"], slug: "lipo-sin-cirugia" },
  { keys: ["porcenalizacion", "porcelanizacion", "porcelanización"], slug: "porcelanizacion" },
];

function norm(value: string) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function zoneLabel(zones: string[]) {
  return zones
    .map((id) => zoneById(id as ZoneId)?.name)
    .filter((name): name is string => Boolean(name))
    .slice(0, 2)
    .join(" · ");
}

export function matchCatalog(items: CatalogItem[], query: string) {
  const q = norm(query.trim());
  if (!q) return items;
  const aliasSlugs = new Set(
    searchAliases.filter((alias) => alias.keys.some((key) => norm(key).includes(q) || q.includes(norm(key)))).map((alias) => alias.slug),
  );
  return items.filter((item) => {
    if (aliasSlugs.has(item.slug)) return true;
    return norm(`${item.name} ${item.summary}`).includes(q);
  });
}
