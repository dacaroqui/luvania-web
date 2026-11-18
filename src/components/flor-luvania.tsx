import { useId, type CSSProperties } from "react";

const PETALS = 8;

/** Flor de 8 pétalos del manual. Solo transform y opacity. */
export function FlorLuvania({ className = "", tone = "brand" }: { className?: string; tone?: "brand" | "light" }) {
  const gid = `f${useId().replace(/:/g, "")}`;
  const from = tone === "light" ? "#fffaf6" : "#F0A486";
  const to = tone === "light" ? "#efecdb" : "#EE876B";
  return (
    <svg className={`flor ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <g className="flor-spin">
        <g className="flor-breathe">
          {Array.from({ length: PETALS }, (_, index) => (
            <g key={index} transform={`rotate(${index * (360 / PETALS)} 32 32)`}>
              <path
                className="flor-petal"
                style={{ animationDelay: `${index * 70}ms` } as CSSProperties}
                d="M32 33.2C27.4 25.4 25.6 15.8 32 5.6C38.4 15.8 36.6 25.4 32 33.2Z"
                fill={`url(#${gid})`}
              />
            </g>
          ))}
          <circle cx="32" cy="32" r="2.3" fill={from} />
        </g>
      </g>
    </svg>
  );
}
