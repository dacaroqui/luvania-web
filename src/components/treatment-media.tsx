import { FlorLuvania } from "./flor-luvania";

/** Foto del tratamiento si existe. Si no, un marco de marca: nunca un antes/después inventado. */
export function TreatmentMedia({ name, image }: { name: string; image?: string }) {
  return (
    <div className="treatment-media">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" />
      ) : (
        <div className="treatment-frame" aria-hidden="true">
          <FlorLuvania />
          <span>{name}</span>
        </div>
      )}
    </div>
  );
}
