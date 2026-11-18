"use client";

import type { AgendaSede } from "@/data/types";
import { captureUtm, remember, track } from "@/lib/analytics";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AgendaSheet } from "./agenda-sheet";
import { CartDrawer } from "./cart-drawer";
import { CartProvider } from "./cart-store";

type AgendaApi = {
  openAgenda: (tratamiento?: string, sede?: string) => void;
  sedes: AgendaSede[];
};

const AgendaContext = createContext<AgendaApi>({
  openAgenda: () => undefined,
  sedes: [],
});

export function useAgenda() {
  return useContext(AgendaContext);
}

export function Providers({ children, sedes }: { children: React.ReactNode; sedes: AgendaSede[] }) {
  const [open, setOpen] = useState(false);
  const [tratamiento, setTratamiento] = useState<string | undefined>();
  const [sede, setSede] = useState<string | undefined>();

  const openAgenda = useCallback((next?: string, sedeSlug?: string) => {
    setTratamiento(next);
    setSede(sedeSlug);
    setOpen(true);
    remember("luvania_origen", window.location.pathname);
    if (next) remember("luvania_tratamiento", next);
    const sedeName = sedes.find((item) => item.slug === sedeSlug)?.name;
    if (sedeName) remember("luvania_sede", sedeName);
    track("cta_click", { tratamiento: next, sede: sedeName });
  }, [sedes]);

  useEffect(() => {
    captureUtm();
    const sync = () => {
      if (window.location.hash === "#agendar") openAgenda();
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [openAgenda]);

  const api = useMemo(() => ({ openAgenda, sedes }), [openAgenda, sedes]);

  return (
    <AgendaContext.Provider value={api}>
      <CartProvider>
        {children}
        <CartDrawer sedes={sedes} />
        <AgendaSheet open={open} tratamientoInicial={tratamiento} sedeInicial={sede} sedes={sedes} onClose={() => setOpen(false)} />
      </CartProvider>
    </AgendaContext.Provider>
  );
}
