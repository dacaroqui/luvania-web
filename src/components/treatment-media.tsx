import { FlorLuvania } from "./flor-luvania";

/** Foto del tratamiento si existe. Si no, un marco de marca: nunca un antes/después inventado. */
export function TreatmentMedia({
  name,
  image,
  caption = false,
}: {
  name: string;
  image?: string;
  caption?: boolean;
}) {
  return (
    <div className="treatment-media">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} />
      ) : (
        <div className="treatment-frame" aria-hidden="true">
          <FlorLuvania />
          {caption ? <span>{name}</span> : null}
        </div>
      )}
    </div>
  );
}
