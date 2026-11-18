"use client";

import { BookButton } from "./book-button";

export function StickyCta() {
  return (
    <div className="sticky-cta fixed inset-x-0 bottom-0 z-40 min-h-[4.75rem] border-t border-line bg-cream/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <BookButton className="btn-coral min-h-12 w-full" />
    </div>
  );
}
