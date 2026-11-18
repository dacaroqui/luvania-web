"use client";

import { remember, track } from "@/lib/analytics";
import { useEffect } from "react";

export function TreatmentView({ name }: { name: string }) {
  useEffect(() => {
    remember("luvania_tratamiento", name);
    track("treatment_view", { tratamiento: name });
  }, [name]);
  return null;
}
