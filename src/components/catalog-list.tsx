import type { CatalogItem } from "@/data/types";
import { especialidades } from "@/data/taxonomy";
import { publicText } from "@/lib/public-copy";
import Link from "next/link";

export function CatalogList({ items }: { items: CatalogItem[] }) {
  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.slug}>
          <Link href={`/tratamientos/${item.slug}`} className="tilt-card flex h-full flex-col rounded-3xl bg-white p-5">
            <p className="text-xs font-bold tracking-[0.14em] text-clay uppercase">
              {especialidades.find((esp) => esp.slug === item.especialidad)?.name}
            </p>
            <h2 className="display mt-2 text-3xl leading-none">{item.name}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-mute">{publicText(item.summary)}</p>
            <span className="mt-4 text-sm font-bold">Ver ficha</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
