export function PhotoPlaceholders() {
  return (
    <section className="ficha-card lp-frames" aria-labelledby="antes-despues">
      <div className="lp-block-head">
        <h2 id="antes-despues" className="display">
          Antes y después
        </h2>
        <span className="lp-badge">Foto real autorizada pendiente</span>
      </div>
      <div className="lp-frame-row">
        <figure>
          <FrameIcon />
          <figcaption>Antes</figcaption>
        </figure>
        <figure className="is-after">
          <FrameIcon />
          <figcaption>Después</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function DoctorPlaceholder() {
  return (
    <div className="lp-doctor glass">
      <FrameIcon />
      <span className="lp-badge">Foto real pendiente</span>
    </div>
  );
}

function FrameIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="24" r="8" />
      <path d="M18 50c2-8 8-12 14-12s12 4 14 12" />
    </svg>
  );
}
