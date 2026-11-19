/** Pétalos de la flor original del manual, en primer plano. No es una flor genérica. */
export function HeroBlooms() {
  return (
    <div className="hero-blooms" aria-hidden="true">
      <svg className="bloom bloom-a" viewBox="0 0 120 120">
        <g transform="translate(60 60)">
          {Array.from({ length: 8 }, (_, index) => (
            <path
              key={index}
              d="M0 2C-8 -12 -10 -28 0 -52C10 -28 8 -12 0 2Z"
              fill={index % 2 === 0 ? "#EE876B" : "#F0A486"}
              transform={`rotate(${index * 45})`}
              opacity={index % 2 === 0 ? 0.95 : 0.8}
            />
          ))}
          <circle r="4" fill="#EFECDB" />
        </g>
      </svg>
      <svg className="bloom bloom-b" viewBox="0 0 80 140">
        <path d="M40 132C22 96 16 58 40 8C64 58 58 96 40 132Z" fill="#F0A486" />
        <path d="M40 120C28 92 24 64 40 28C56 64 52 92 40 120Z" fill="#EE876B" opacity="0.85" />
      </svg>
      <svg className="bloom bloom-c" viewBox="0 0 80 140">
        <path d="M40 132C22 96 16 58 40 8C64 58 58 96 40 132Z" fill="#EE876B" />
      </svg>
    </div>
  );
}
