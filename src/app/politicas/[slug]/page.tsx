import { Breadcrumbs, breadcrumbLd } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { legalDocs } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const pages = {
  "datos-personales": {
    doc: legalDocs[0],
    title: "Tratamiento de datos personales | Luvania",
    description: "Política de privacidad y tratamiento de datos personales de Luvania, en el PDF vigente de la red.",
    intro:
      "El sitio anterior enlazaba esta política en un PDF, con el nombre en minúsculas. No reescribimos el documento legal: aquí está el enlace al archivo publicado por Luvania.",
  },
  "cambios-y-devoluciones": {
    doc: legalDocs[1],
    title: "Cambios y devoluciones | Luvania",
    description: "Política de cambios y devoluciones de Luvania, en el PDF vigente de la red.",
    intro:
      "La política de cambios vive en un PDF con el nombre en mayúsculas, distinto del archivo de privacidad. El enlace apunta al mismo documento que el pie del sitio anterior.",
  },
} as const;

type Params = { slug: string };

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug as keyof typeof pages];
  if (!page) return {};
  return pageMeta({ title: page.title, description: page.description, path: page.doc.href });
}

export default async function PoliticaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = pages[slug as keyof typeof pages];
  if (!page) notFound();
  const crumbs = [{ name: page.doc.title, href: page.doc.href }];
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="display mt-6 text-5xl">{page.doc.title}</h1>
      <p className="mt-4 leading-7">{page.intro}</p>
      <p className="mt-6">
        <a className="font-bold underline decoration-coral underline-offset-4" href={page.doc.pdf}>
          Abrir {page.doc.pdfLabel}
        </a>
      </p>
      <p className="mt-4 text-sm text-mute">
        El PDF sigue alojado en luvania.com. Si esa URL cambia, hay que actualizar el enlace en los datos del sitio.
      </p>
    </main>
  );
}
