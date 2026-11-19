import type { GuideFigureKind } from "@/data/guides/types";

export function GuideArt({ kind, alt, caption }: { kind: GuideFigureKind; alt: string; caption: string }) {
  return (
    <figure className="guia-figure">
      <Art kind={kind} label={alt} />
      <figcaption>
        <span>Ilustración</span>
        {caption}
      </figcaption>
    </figure>
  );
}

function Art({ kind, label }: { kind: GuideFigureKind; label: string }) {
  return (
    <svg viewBox="0 0 640 340" role="img" aria-label={label}>
      <rect width={640} height={340} rx={28} fill="#EFECDB" />
      {kind === "union" ? <Union /> : null}
      {kind === "foliculo" ? <Foliculo /> : null}
      {kind === "parpado" ? <Parpado /> : null}
      {kind === "labio" ? <Labio /> : null}
      {kind === "septos" ? <Septos /> : null}
      {kind === "gluteo" ? <Gluteo /> : null}
      {kind === "ciclo" ? <Ciclo /> : null}
    </svg>
  );
}

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fill="#1A1A1A" fontSize={15} fontFamily="inherit">
      {children}
    </text>
  );
}

function Union() {
  return (
    <g>
      <rect x={36} y={46} width={150} height={64} rx={32} fill="#F1CEB3" stroke="#8D3D2C" strokeWidth={2} />
      <Label x={111} y={84}>Nervio</Label>
      <circle cx={210} cy={78} r={14} fill="#F0A486" stroke="#8D3D2C" />
      <circle cx={246} cy={78} r={14} fill="#F0A486" stroke="#8D3D2C" />
      <circle cx={282} cy={78} r={14} fill="#EE876B" stroke="#8D3D2C" />
      <Label x={246} y={122}>Acetilcolina</Label>
      <rect x={318} y={58} width={132} height={40} rx={10} fill="#fff" stroke="#8D3D2C" strokeWidth={2} />
      <Label x={384} y={84}>SNAP-25</Label>
      <path d="M386 54 v48" stroke="#EE876B" strokeWidth={3} strokeDasharray="4 4" />
      <path d="M460 78 H520" stroke="#8D3D2C" strokeWidth={2} />
      <path d="M504 66 l22 12 -22 12" fill="none" stroke="#8D3D2C" strokeWidth={2} />
      <path d="M490 96 l18 16" stroke="#EE876B" strokeWidth={3} />
      <rect x={548} y={46} width={56} height={200} rx={16} fill="#F0A486" stroke="#8D3D2C" strokeWidth={2} />
      <path d="M560 78 H592 M560 108 H592 M560 138 H592 M560 168 H592 M560 198 H592 M560 228 H592" stroke="#8D3D2C" strokeWidth={1.4} />
      <Label x={300} y={210}>Sin fusión, no hay orden</Label>
      <Label x={576} y={276}>Músculo</Label>
    </g>
  );
}

function Foliculo() {
  return (
    <g>
      <rect x={40} y={36} width={250} height={268} rx={18} fill="#F1CEB3" stroke="#8D3D2C" strokeWidth={2} />
      <rect x={40} y={36} width={250} height={48} rx={18} fill="#F0A486" />
      <rect x={40} y={60} width={250} height={24} fill="#F0A486" />
      <Label x={165} y={66}>Epidermis</Label>
      <path d="M150 72 v70 c0 40 -46 48 -46 110 v40 h92 v-40 c0 -62 -46 -70 -46 -110z" fill="#EFECDB" stroke="#8D3D2C" strokeWidth={2} />
      <ellipse cx={150} cy={128} rx={28} ry={16} fill="#EE876B" />
      <Label x={150} y={176}>Tapón</Label>
      <ellipse cx={214} cy={168} rx={34} ry={22} fill="#EE876B" stroke="#8D3D2C" />
      <Label x={214} y={172}>Sebo</Label>
      <circle cx={118} cy={230} r={7} fill="#EE876B" />
      <circle cx={136} cy={248} r={5} fill="#8D3D2C" />
      <Label x={470} y={100}>1. El sebo no sale</Label>
      <Label x={470} y={140}>2. El poro se tapa</Label>
      <Label x={470} y={180}>3. La pared se inflama</Label>
      <Label x={470} y={240}>No es suciedad</Label>
    </g>
  );
}

function Parpado() {
  return (
    <g>
      <path d="M40 110 C160 50 300 50 400 120 C300 170 160 170 40 110Z" fill="#F1CEB3" stroke="#8D3D2C" strokeWidth={2} />
      <path d="M70 112 C170 78 290 86 370 122" fill="none" stroke="#EE876B" strokeWidth={8} strokeLinecap="round" />
      <circle cx={230} cy={112} r={8} fill="#8D3D2C" />
      <path d="M120 168 c50 46 150 50 230 16" fill="none" stroke="#8D3D2C" strokeWidth={2} strokeDasharray="5 5" />
      <Label x={210} y={86}>Piel delgada</Label>
      <Label x={520} y={110}>Pigmento</Label>
      <Label x={520} y={150}>Vaso visible</Label>
      <Label x={520} y={210}>Surco: una sombra</Label>
    </g>
  );
}

function Labio() {
  return (
    <g>
      <path d="M70 160 C140 70 250 70 320 160 C250 250 140 250 70 160Z" fill="#F0A486" stroke="#8D3D2C" strokeWidth={2} />
      <path d="M120 160 C170 112 230 112 280 160 C230 208 170 208 120 160Z" fill="#EE876B" stroke="#8D3D2C" />
      <circle cx={176} cy={150} r={6} fill="#EFECDB" />
      <circle cx={198} cy={168} r={5} fill="#EFECDB" />
      <circle cx={214} cy={146} r={4} fill="#EFECDB" />
      <Label x={196} y={280}>Gel en el labio</Label>
      <Label x={490} y={130}>Retiene agua</Label>
      <Label x={490} y={170}>Ocupa un lugar</Label>
      <Label x={490} y={220}>El cuerpo lo degrada</Label>
    </g>
  );
}

function Septos() {
  return (
    <g>
      <path d="M40 90 C90 56 130 120 180 88 C230 56 270 120 320 88 C370 56 410 120 470 84 C510 64 540 72 580 68 L580 240 L40 240Z" fill="#F1CEB3" stroke="#8D3D2C" strokeWidth={2} />
      <path d="M130 100 V200" stroke="#8D3D2C" strokeWidth={3} />
      <path d="M270 86 V214" stroke="#8D3D2C" strokeWidth={3} />
      <path d="M410 100 V196" stroke="#8D3D2C" strokeWidth={3} />
      <circle cx={190} cy={170} r={28} fill="#F0A486" stroke="#8D3D2C" />
      <circle cx={340} cy={178} r={32} fill="#F0A486" stroke="#8D3D2C" />
      <circle cx={480} cy={168} r={26} fill="#F0A486" stroke="#8D3D2C" />
      <Label x={190} y={292}>Tabique que tira</Label>
      <Label x={430} y={292}>Grasa que empuja</Label>
    </g>
  );
}

function Gluteo() {
  return (
    <g>
      <path d="M190 40 C90 80 70 180 100 250 C130 310 240 320 290 260 C350 180 310 70 190 40Z" fill="#F1CEB3" stroke="#8D3D2C" strokeWidth={2} />
      <path d="M160 96 C128 146 140 214 180 252" fill="none" stroke="#EE876B" strokeWidth={10} strokeLinecap="round" />
      <ellipse cx={210} cy={164} rx={46} ry={62} fill="#F0A486" stroke="#8D3D2C" strokeWidth={2} />
      <Label x={210} y={168}>Músculo</Label>
      <Label x={490} y={120}>Piel</Label>
      <Label x={490} y={160}>Grasa</Label>
      <Label x={490} y={200}>Glúteo mayor</Label>
      <Label x={490} y={260}>Las tres capas</Label>
    </g>
  );
}

function Ciclo() {
  return (
    <g>
      <Stage x={40} title="Anagén" hair="M125 150 V52" note="Crece" />
      <Stage x={235} title="Catagén" hair="M320 150 V96" note="Se detiene" />
      <Stage x={430} title="Telogén" hair="M515 150 V124" note="Se suelta" />
    </g>
  );
}

function Stage({ x, title, hair, note }: { x: number; title: string; hair: string; note: string }) {
  return (
    <g>
      <rect x={x} y={36} width={170} height={250} rx={18} fill="#F1CEB3" stroke="#8D3D2C" strokeWidth={2} />
      <Label x={x + 85} y={70}>{title}</Label>
      <path d={hair} stroke="#8D3D2C" strokeWidth={4} strokeLinecap="round" />
      <ellipse cx={x + 85} cy={190} rx={28} ry={36} fill="#EFECDB" stroke="#8D3D2C" strokeWidth={2} />
      <Label x={x + 85} y={258}>{note}</Label>
    </g>
  );
}
