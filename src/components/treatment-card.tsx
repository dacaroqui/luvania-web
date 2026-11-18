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
    <Link href={`/tratamientos/${slug}`} className="treatment-card tilt-card">
      <TreatmentMedia name={name} image={image} />
      <div className="treatment-card-copy">
        {kicker ? <p className="text-xs font-bold tracking-[0.14em] text-clay uppercase">{kicker}</p> : null}
        <h2 className="display treatment-card-name">{name}</h2>
        {text ? <p className="mt-2 text-sm leading-6 text-mute">{text}</p> : null}
      </div>
    </Link>
  );
}
