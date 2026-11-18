import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { PqrsForm } from "@/components/pqrs-form";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Peticiones, quejas y reclamos | Luvania",
  description:
    "Radica una petición, queja, reclamo o recurso ante Luvania. La solicitud se arma en tu correo, sin pasar por un servidor nuestro.",
  path: "/pqrs",
});

export default function PqrsPage() {
  const crumbs = [{ name: "PQRS", href: "/pqrs" }];
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl">Peticiones, quejas y reclamos</h1>
      <p className="mt-4 leading-7">
        Cuéntanos con detalle qué pasó. Mientras no haya un buzón propio, el formulario abre un correo a{" "}
        <a className="font-bold underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>
      <PqrsForm />
    </main>
  );
}
