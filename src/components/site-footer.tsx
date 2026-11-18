import { legalDocs, site } from "@/data/site";
import { sedes } from "@/data/sedes";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="display text-4xl">Luvania</p>
          <p className="mt-3 text-sm leading-6 text-peach">
            Red de clínicas estéticas en Bogotá. Marca de {site.brandOf}.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-salmon uppercase">Sedes</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {sedes.map((sede) => (
              <li key={sede.slug}>
                <Link href={`/sedes/${sede.slug}`} className="hover:text-peach">
                  {sede.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-salmon uppercase">Visita</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link href="/tratamientos">Tratamientos</Link>
            </li>
            <li>
              <Link href="/promociones">Promociones</Link>
            </li>
            <li>
              <Link href="/experiencias">Experiencias</Link>
            </li>
            <li>
              <Link href="/franquicias">Franquicias</Link>
            </li>
            <li>
              <Link href="/pqrs">PQRS</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm leading-6">
          <p className="text-xs font-bold tracking-[0.16em] text-salmon uppercase">Contacto</p>
          <p className="mt-3">
            <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
          </p>
          <p>
            <a href={`tel:${site.mobileTel}`}>{site.mobileDisplay}</a>
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p className="mt-3 text-peach">Lunes a viernes 8:00 a. m. – 5:00 p. m. · Sábados 8:00 a. m. – 3:00 p. m.</p>
          <p className="text-peach/80">Horario del pie de la red. Cada sede publica el suyo.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-peach sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Luvania. Bogotá, Colombia.</p>
          <ul className="flex flex-wrap gap-4">
            {legalDocs.map((doc) => (
              <li key={doc.slug}>
                <Link href={doc.href}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
