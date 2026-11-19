"use client";

import type { AgendaSede } from "@/data/types";
import { extraNeedsFor } from "@/data/landings";
import { useEffect, useRef } from "react";
import { CloseButton } from "./close-button";
import { ValuationWizard } from "./lp/valuation-wizard";

export function AgendaSheet({
  open,
  tratamientoInicial,
  tratamientoId,
  necesidadId,
  sedeInicial,
  promoInicial,
  sedes,
  preview,
  onClose,
}: {
  open: boolean;
  tratamientoInicial?: string;
  tratamientoId?: string;
  necesidadId?: string;
  sedeInicial?: string;
  promoInicial?: string;
  sedes: AgendaSede[];
  preview: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const needId = necesidadId || "valoracion";

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
      returnFocus.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet agenda-dialog vx-dialog"
      aria-label="Agenda tu valoración"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="vx-dialog-bar">
        <CloseButton onClick={onClose} />
      </div>
      {open ? (
        <ValuationWizard
          frame="dialog"
          preview={preview}
          needId={needId}
          path={typeof window === "undefined" ? "/" : window.location.pathname}
          questions={[]}
          extras={extraNeedsFor(needId)}
          sedes={sedes}
          origin={tratamientoInicial ? { id: tratamientoId || tratamientoInicial, name: tratamientoInicial } : null}
          promo={promoInicial}
          initialSede={sedeInicial ?? null}
          deliverWhatsapp
        />
      ) : null}
    </dialog>
  );
}
