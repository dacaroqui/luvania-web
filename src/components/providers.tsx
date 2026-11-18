"use client";

import type { Sede } from "@/data/types";
import { captureUtm, remember, track } from "@/lib/analytics";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AgendaSheet } from "./agenda-sheet";

type AgendaApi = {
  openAgenda: (tratamiento?: string) => void;
  sedes: Sede[];
};

const AgendaContext = createContext<AgendaApi>({
  openAgenda: () => undefined,
  sedes: [],
});

export function useAgenda() {
  return useContext(AgendaContext);
}

export function Providers({ children, sedes }: { children: React.ReactNode; sedes: Sede[] }) {
  const [open, setOpen] = useState(false);
  const [tratamiento, setTratamiento] = useState<string | undefined>();

  const openAgenda = useCallback((next?: string) => {
    setTratamiento(next);
    setOpen(true);
    remember("luvania_origen", window.location.href);
    if (next) remember("luvania_tratamiento", next);
    track("cta_click", { tratamiento: next, origen: window.location.href });
  }, []);

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
      {children}
      <AgendaSheet open={open} tratamientoInicial={tratamiento} sedes={sedes} onClose={() => setOpen(false)} />
    </AgendaContext.Provider>
  );
}
