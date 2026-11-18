import Link from "next/link";

const zones = [
  { id: "rostro", name: "Rostro", href: "/zonas/rostro", d: "M150 42c18 0 30 16 30 34s-8 36-22 46c-10 8-28 8-38 0-14-10-22-28-22-46S132 42 150 42z" },
  { id: "ojo", name: "Ojos", href: "/zonas/ojos", d: "M132 68h36c0 8-8 14-18 14s-18-6-18-14z" },
  { id: "labios", name: "Labios", href: "/zonas/labios", d: "M136 100c8 8 20 8 28 0-8 6-20 6-28 0z" },
  { id: "cuerpo", name: "Cuerpo", href: "/zonas/cuerpo", d: "M118 140c10 28 8 70-6 110h76c-14-40-16-82-6-110-16 12-48 12-64 0z" },
];

export function BodyMap() {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[280px_1fr]">
      <svg viewBox="0 0 300 320" className="mx-auto w-full max-w-xs" role="img" aria-label="Silueta con zonas clicables">
        <g fill="#f7f4ea" stroke="#1a1a1a" strokeWidth="1.4">
          {zones.map((zone) => (
            <a key={zone.id} href={zone.href}>
              <path d={zone.d} className="transition hover:fill-peach">
                <title>{zone.name}</title>
              </path>
            </a>
          ))}
        </g>
      </svg>
      <ul className="grid gap-2">
        {zones.map((zone) => (
          <li key={zone.id}>
            <Link href={zone.href} className="flex min-h-11 items-center rounded-2xl bg-white px-4 font-semibold">
              {zone.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
