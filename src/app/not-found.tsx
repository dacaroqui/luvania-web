import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24">
      <h1 className="display text-5xl">Esa página no está.</h1>
      <p className="mt-4 text-mute">
        El enlace del logo viejo y la sede de Cedritos ya no llevan a ningún lado. El catálogo sí.
      </p>
      <Link href="/tratamientos" className="mt-6 inline-flex min-h-12 items-center font-bold underline">
        Ir a tratamientos
      </Link>
    </main>
  );
}
