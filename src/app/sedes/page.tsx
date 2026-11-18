import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { sedes } from "@/data/sedes";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Sedes de Luvania en Bogotá",
  description:
    "Restrepo, Modelia, Chicó, Venecia y Colina. Direcciones, horarios y WhatsApp de cada clínica Luvania.",
  path: "/sedes",
});

export default function SedesPage() {
  const crumbs = [{ name: "Sedes", href: "/sedes" }];
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl sm:text-6xl">Sedes en Bogotá</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">
        Restrepo, Modelia, Chicó, Venecia y Colina.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {sedes.map((sede) => (
          <li key={sede.slug}>
            <Link href={`/sedes/${sede.slug}`} className="block rounded-3xl bg-white p-6 hover:-translate-y-1">
              <h2 className="display text-4xl">{sede.name}</h2>
              <p className="mt-2">{sede.address}</p>
              <p className="mt-2 text-sm text-mute">{sede.phoneDisplay}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
