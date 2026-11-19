import { LandingView } from "@/components/lp/landing-view";
import { getTreatment } from "@/data";
import { allLandings, getLanding } from "@/data/landings";
import { placeholdersVisible } from "@/lib/placeholders";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { necesidad: string };

export function generateStaticParams() {
  return allLandings().map((landing) => ({ necesidad: landing.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { necesidad } = await params;
  const landing = getLanding(necesidad);
  if (!landing) return {};
  return pageMeta({
    title: landing.title,
    description: landing.description,
    path: `/lp/${landing.slug}`,
    index: false,
  });
}

export default async function LandingPage({ params }: { params: Promise<Params> }) {
  const { necesidad } = await params;
  const landing = getLanding(necesidad);
  if (!landing) notFound();
  const treatment = landing.treatmentSlug ? getTreatment(landing.treatmentSlug) : undefined;
  if (landing.treatmentSlug && !treatment) notFound();
  return <LandingView landing={landing} treatment={treatment} preview={placeholdersVisible()} />;
}
