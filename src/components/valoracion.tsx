import { BookButton } from "./book-button";

const benefits = [
  ["Cuenta qué te gustaría mejorar", "El equipo escucha tu objetivo y revisa la zona contigo."],
  ["Conoce tus opciones", "Pregunta por el plan, el costo y los cuidados que debes considerar."],
  ["Elige cuándo empezar", "Puedes decidir después de la cita. La valoración no te compromete a un tratamiento."],
];

export function Valoracion({
  tratamiento,
  tratamientoId,
  necesidad,
  promo,
}: {
  tratamiento?: string;
  tratamientoId?: string;
  necesidad?: string;
  promo?: string;
}) {
  return (
    <section data-tone="peach" className="valuation-callout">
      <div className="valuation-content">
        <div className="valuation-copy" data-reveal>
          <h2 className="display">Encuentra un plan para ti</h2>
          <p>Sal de tu valoración con más claridad sobre tus opciones y cuánto costaría empezar.</p>
          <BookButton tratamiento={tratamiento} tratamientoId={tratamientoId} necesidad={necesidad} promo={promo}>
            Agendar mi valoración
          </BookButton>
        </div>
        <ul className="valuation-benefits">
          {benefits.map(([title, description]) => (
            <li key={title} data-reveal data-pointer>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
