import { clampMeta, pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Blog | Luvania",
  description: clampMeta("El blog de Luvania está por abrir. Todavía no hay artículos publicados."),
  path: "/blog",
  index: false,
});

export default function BlogPage() {
  return (
    <main className="bg-cream">
      <article className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-xs font-bold tracking-[0.22em] text-clay uppercase">Blog</p>
        <h1 className="display mt-4 text-6xl sm:text-7xl">Próximamente</h1>
        <p className="mt-5 max-w-md leading-7 text-mute">
          Aquí vivirán las notas de la marca. Todavía no hay artículos publicados.
        </p>
        <Link href="/tratamientos" className="btn-line mt-8">
          Explorar tratamientos
        </Link>
      </article>
    </main>
  );
}
