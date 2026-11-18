"use client";

import { useBooking } from "./providers";

export function StickyCta() {
  const { openBooking } = useBooking();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 p-3 backdrop-blur md:hidden">
      <button
        type="button"
        onClick={() => openBooking()}
        className="min-h-12 w-full rounded-full bg-coral text-sm font-bold text-ink"
      >
        Agenda tu valoración sin costo
      </button>
    </div>
  );
}
