import { FlorLuvania } from "./flor-luvania";
import Image from "next/image";

export function LogoLockup({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={`logo-frame ${className}`}>
      <Image
        src="/brand/luvania-logo.png"
        alt=""
        width={600}
        height={247}
        priority={priority}
        className="logo-img"
      />
      <FlorLuvania className="logo-flor" />
    </span>
  );
}
