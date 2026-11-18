import { site } from "@/data/site";
import Link from "next/link";

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  const all = [{ name: "Inicio", href: "/" }, ...items];
  return (
    <nav aria-label="Miga de pan" className="text-sm text-mute">
      <ol className="flex flex-wrap items-center gap-2">
        {all.map((item, index) => {
          const last = index === all.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !last ? (
                <Link href={item.href} className="underline decoration-peach underline-offset-4">
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined}>{item.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function breadcrumbLd(items: { name: string; href?: string }[]) {
  const all = [{ name: "Inicio", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href ? `${site.url}${item.href}` : undefined,
    })),
  };
}
