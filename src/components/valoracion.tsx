import { FlorLuvania } from "./flor-luvania";
import { BookButton } from "./book-button";

const steps = [
  ["1", "Eliges la sede", "Restrepo, Modelia, Chicó, Venecia o Colina."],
  ["2", "Cuentas qué te preocupa", "Sin tener el nombre del tratamiento."],
  ["3", "El equipo mira la zona", "Te explica opciones, tiempos y cuidados."],
  ["4", "Tú decides", "Sigues solo si el plan te hace sentido."],
];

export function Valoracion() {
  return (
    <section data-tone="peach" className="relative z-[1] overflow-hidden bg-[#f1ceb3]">
      <FlorLuvania className="flor-glow" />
      <div className="relative z-[1] mx-auto grid max-w-6xl items-start gap-10 px-4 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-bold tracking-[0.16em] text-clay uppercase">La primera conversación</p>
          <h2 className="display mt-3 text-5xl">Cómo es tu valoración</h2>
          <p className="mt-4 max-w-sm text-mute">Una cita para mirar la zona y decidir con calma. Sin compromiso de tratamiento.</p>
        </div>
        <ol className="grid gap-4">
          {steps.map(([n, title, copy], index) => (
            <li key={n} className="reveal rounded-3xl bg-cream p-6" style={{ animationDelay: `${index * 80}ms` }}>
              <p className="display text-3xl text-coral">{n}</p>
              <h3 className="mt-2 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-mute">{copy}</p>
            </li>
          ))}
          <li>
            <BookButton />
          </li>
        </ol>
      </div>
    </section>
  );
}
