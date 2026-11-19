"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const DemoAllowedContext = createContext(false);

/** El query ?demo=carrito solo enciende el botón fuera de producción. */
export function DemoCartProvider({ allowed, children }: { allowed: boolean; children: ReactNode }) {
  return <DemoAllowedContext.Provider value={allowed}>{children}</DemoAllowedContext.Provider>;
}

export function useDemoCart() {
  const allowed = useContext(DemoAllowedContext);
  const pathname = usePathname();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!allowed) {
      setOn(false);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    setOn(params.get("demo") === "carrito");
  }, [allowed, pathname]);

  return on;
}
