import Link from "next/link";
import { heroCopy } from "@/data/hero";
import { BookButton } from "./book-button";
import { HeroScene } from "./hero-petals";

const benefits = [
  { name: "Tecnología avanzada", icon: "spark" },
  { name: "Acompañamiento personalizado", icon: "person" },
  { name: "Resultados naturales", icon: "shield" },
] as const;

export function Hero() {
  return (
    <HeroScene>
      <div className="hero-grid mx-auto px-4">
        <div className="hero-copy">
          <p className="hero-eyebrow">{heroCopy.eyebrow}</p>
          <h1 className="display hero-title">
            <span>Realza tu</span>
            <span>belleza natural</span>
          </h1>
          <p className="hero-lead">{heroCopy.lead}</p>
          <div className="hero-actions">
            <BookButton />
            <Link href="/sobre-luvania" className="btn-line hero-outline">
              <i aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M6.2 4.4v7.2L12 8 6.2 4.4Z" fill="currentColor" />
                </svg>
              </i>
              {heroCopy.secondary}
            </Link>
          </div>
        </div>
        <ul className="hero-benefits">
          {benefits.map((item) => (
            <li key={item.name}>
              <BenefitIcon name={item.icon} />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </HeroScene>
  );
}

function BenefitIcon({ name }: { name: (typeof benefits)[number]["icon"] }) {
  if (name === "person") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="11" r="4" />
        <path d="M8 25c1.2-4 4-6 8-6s6.8 2 8 6" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 5 26 9v7c0 6-4 10-10 12C10 26 6 22 6 16V9l10-4Z" />
        <path d="M12 16.5 15 19.5 20.5 13" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 6v4M16 22v4M6 16h4M22 16h4M9 9l2.6 2.6M20.4 20.4 23 23M23 9l-2.6 2.6M11.6 20.4 9 23" />
      <circle cx="16" cy="16" r="3.2" />
    </svg>
  );
}
