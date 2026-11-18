import type { CatalogItem } from "./types";
import catalogRaw from "./catalog-index.json";

export const catalog = catalogRaw as CatalogItem[];

export function verifiedCatalog() {
  return catalog.filter((item) => item.status === "VERIFIED");
}
