import { existsSync } from "node:fs";
import path from "node:path";

/** Fachadas reales. Restrepo y Colina siguen sin foto propia. */
export const sedePhotos: Record<string, { src: string; alt: string }> = {
  chico: {
    src: "/sedes/chico.webp",
    alt: "Fachada de Luvania Chicó, local de frente gris claro y vidrio.",
  },
  modelia: {
    src: "/sedes/modelia.webp",
    alt: "Fachada de Luvania Modelia, local negro con globos en la entrada.",
  },
  venecia: {
    src: "/sedes/venecia.webp",
    alt: "Fachada de Luvania Venecia, local negro con piso de ajedrez.",
  },
};

export function sedePhoto(slug: string) {
  const item = sedePhotos[slug];
  if (!item) return undefined;
  const file = path.join(process.cwd(), "public", item.src.replace(/^\//, ""));
  return existsSync(file) ? item.src : undefined;
}

export function sedeAlt(slug: string) {
  return sedePhotos[slug]?.alt ?? "";
}
