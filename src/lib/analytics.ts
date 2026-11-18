"use client";

export type AnalyticsEvent =
  | "cta_click"
  | "sede_select"
  | "whatsapp_start"
  | "lead_submit"
  | "search_no_results"
  | "filter_use"
  | "treatment_view";

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function captureUtm() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  for (const key of UTM) {
    const value = params.get(key);
    if (value) sessionStorage.setItem(key, value);
  }
}

export function remember(key: "luvania_tratamiento" | "luvania_sede" | "luvania_origen", value: string) {
  sessionStorage.setItem(key, value);
}

export function track(event: AnalyticsEvent, params: Record<string, string | undefined> = {}) {
  if (typeof window === "undefined") return;
  const utm: Record<string, string> = {};
  for (const key of UTM) {
    const value = sessionStorage.getItem(key);
    if (value) utm[key] = value;
  }
  const payload = {
    event,
    tratamiento: params.tratamiento ?? sessionStorage.getItem("luvania_tratamiento") ?? "",
    sede: params.sede ?? sessionStorage.getItem("luvania_sede") ?? "",
    origen: params.origen ?? sessionStorage.getItem("luvania_origen") ?? window.location.href,
    ...utm,
    ...params,
  };
  const layer = (window.dataLayer ??= []);
  layer.push(payload);
  window.gtag?.("event", event, payload);
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}
