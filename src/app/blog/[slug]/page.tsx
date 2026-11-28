import { JsonLd } from "@/components/json-ld";
import { blogArticles, getBlogArticle } from "@/data/blog-articles";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const article = getBlogArticle((await params).slug);
  if (!article) notFound();

  return pageMeta({
    title: `${article.title} | Blog Luvania`,
    description: article.description,
    path: `/blog/${article.slug}`,
    image: article.image.src,
    imageAlt: article.image.alt,
    imageSize: article.image,
    type: "article",
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const article = getBlogArticle((await params).slug);
  if (!article) notFound();
  const url = `${site.url}/blog/${article.slug}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8 sm:py-16">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        inLanguage: "es-CO",
        mainEntityOfPage: url,
        image: new URL(article.image.src, site.url).href,
        author: { "@type": "Organization", name: site.name, url: site.url },
        publisher: { "@type": "Organization", name: site.name, url: site.url },
      }} />
      <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-mute">
        <Link href="/blog" className="underline underline-offset-4">Blog de Luvania</Link>
      </nav>
      <article>
        <header>
          <h1 className="display text-4xl sm:text-6xl">{article.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-mute">{article.summary}</p>
          <Image
            src={article.image.src} alt={article.image.alt}
            width={article.image.width} height={article.image.height}
            className="mt-8 aspect-[3/2] w-full rounded-3xl object-cover"
            sizes="(max-width: 895px) 100vw, 832px" priority
          />
        </header>
        {article.sections.map((section) => (
          <section key={section.title} className="mt-9 max-w-3xl">
            <h2 className="display text-3xl">{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8">{paragraph}</p>)}
          </section>
        ))}
        <nav aria-label="Enlaces relacionados" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-current/15 pt-6">
          {article.links.map((link) => <Link key={link.href} href={link.href} className="text-clay underline underline-offset-4">{link.label}</Link>)}
        </nav>
      </article>
    </main>
  );
}
