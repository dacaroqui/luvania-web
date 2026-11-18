"use client";

import { useBooking } from "./providers";

export function BookButton({
  tratamiento,
  children,
  className,
}: {
  tratamiento?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { openBooking } = useBooking();
  return (
    <button type="button" className={className} onClick={() => openBooking(tratamiento)}>
      {children}
    </button>
  );
}
