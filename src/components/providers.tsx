"use client";

import type { AgendaSede } from "@/data/types";
import { captureUtm, remember, track } from "@/lib/analytics";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AgendaSheet } from "./agenda-sheet";
import { CartDrawer } from "./cart-drawer";
import { CartProvider } from "./cart-store";
import { DemoCartProvider } from "./demo-cart";
import { SedeGate } from "./sede-gate";

type AgendaRequest = { tratamiento?: string; sede?: string; promo?: string };

type AgendaApi = {
  openAgenda: (request?: AgendaRequest) => void;
  sedes: AgendaSede[];
};

const AgendaContext = createContext<AgendaApi>({
  openAgenda: () => undefined,
  sedes: [],
});

export function useAgenda() {
  return useContext(AgendaContext);
}

export function Providers({
  children,
  sedes,
  demoCart,
}: {
  children: React.ReactNode;
  sedes: AgendaSede[];
  demoCart: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [tratamiento, setTratamiento] = useState<string | undefined>();
  const [sede, setSede] = useState<string | undefined>();
  const [promo, setPromo] = useState<string | undefined>();

  const openAgenda = useCallback((request?: AgendaRequest) => {
    setTratamiento(request?.tratamiento);
    setSede(request?.sede);
    setPromo(request?.promo);
    setOpen(true);
    remember("luvania_origen", window.location.pathname);
    if (request?.tratamiento) remember("luvania_tratamiento", request.tratamiento);
    const sedeName = sedes.find((item) => item.slug === request?.sede)?.name;
    if (sedeName) remember("luvania_sede", sedeName);
    track("cta_click", { tratamiento: request?.tratamiento, sede: sedeName });
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
      <DemoCartProvider allowed={demoCart}>
        <CartProvider>
          {children}
          <CartDrawer sedes={sedes} />
          <SedeGate sedes={sedes} />
          <AgendaSheet
            open={open}
            tratamientoInicial={tratamiento}
            sedeInicial={sede}
            promoInicial={promo}
            sedes={sedes}
            onClose={() => setOpen(false)}
          />
        </CartProvider>
      </DemoCartProvider>
    </AgendaContext.Provider>
  );
}
