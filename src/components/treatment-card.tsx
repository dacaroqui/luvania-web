import { getTreatment } from "@/data";
import { publicText } from "@/lib/public-copy";
import Link from "next/link";
import { TreatmentMedia } from "./treatment-media";

export function TreatmentCard({
  slug,
  name,
  summary,
  kicker,
}: {
  slug: string;
  name: string;
  summary?: string;
  kicker?: string;
}) {
  const text = publicText(summary);
  const image = getTreatment(slug)?.image;
  return (
    <Link href={`/tratamientos/${slug}`} className="catalog-card glass">
      <span className="catalog-card-media">
        <TreatmentMedia name={name} image={image} />
        {kicker ? <span className="catalog-kicker">{kicker}</span> : null}
      </span>
      <span className="catalog-card-copy">
        <h2 className="display catalog-name">{name}</h2>
        {text ? <span className="catalog-summary">{text}</span> : null}
        <span className="catalog-foot">
          <span className="catalog-price">Ver ficha</span>
          <span className="catalog-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </span>
    </Link>
  );
}
