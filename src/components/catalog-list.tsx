import { TreatmentCard } from "@/components/treatment-card";
import type { CatalogItem } from "@/data/types";
import { especialidades } from "@/data/taxonomy";

export function CatalogList({ items }: { items: CatalogItem[] }) {
  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.slug}>
          <TreatmentCard
            slug={item.slug}
            name={item.name}
            summary={item.summary}
            kicker={especialidades.find((esp) => esp.slug === item.especialidad)?.name}
          />
        </li>
      ))}
    </ul>
  );
}
