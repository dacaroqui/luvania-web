"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { BookingDialog } from "./booking-dialog";
import { SmoothScroll } from "./smooth-scroll";

type BookingApi = {
  openBooking: (tratamiento?: string) => void;
};

const BookingContext = createContext<BookingApi>({
  openBooking: () => undefined,
});

export function useBooking() {
  return useContext(BookingContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tratamiento, setTratamiento] = useState<string | undefined>();

  const openBooking = useCallback((next?: string) => {
    setTratamiento(next);
    setOpen(true);
  }, []);

  const api = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={api}>
      <MotionConfig reducedMotion="user">
        <SmoothScroll />
        {children}
        <BookingDialog
          open={open}
          tratamientoInicial={tratamiento}
          onClose={() => setOpen(false)}
        />
      </MotionConfig>
    </BookingContext.Provider>
  );
}
