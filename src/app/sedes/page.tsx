import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { sedes } from "@/data/sedes";
import { sedeAlt, sedePhoto } from "@/data/sede-photos";
import { isInternal } from "@/lib/public-copy";
import { clampMeta, pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Sedes de Luvania en Bogotá",
  description:
    clampMeta("Restrepo, Modelia, Chicó, Venecia y Colina. Direcciones, horarios y WhatsApp de cada clínica Luvania."),
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
            <Link href={`/sedes/${sede.slug}`} className="sede-card block overflow-hidden">
              {sedePhoto(sede.slug) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sedePhoto(sede.slug)} alt={sedeAlt(sede.slug)} className="aspect-[16/9] w-full object-cover" />
              ) : null}
              <div className="p-6">
              <h2 className="display text-4xl">{sede.name}</h2>
              <p className="mt-2">{sede.address}</p>
              {sede.phoneDisplay && !isInternal(sede.phoneDisplay) ? (
                <p className="mt-2 text-sm text-mute">{sede.phoneDisplay}</p>
              ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
