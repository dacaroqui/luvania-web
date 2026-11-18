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

const PRIVATE_KEY = /nombre|celular|email|tel[eé]fono|phone|c[eé]dula|documento|mensaje/i;

function clean(value: string | null | undefined) {
  if (!value) return "";
  const text = value.trim().slice(0, 120);
  if (!text || /@/.test(text) || /(?:\d[\s().-]?){8,}/.test(text)) return "";
  return text;
}

export function track(event: AnalyticsEvent, params: Record<string, string | undefined> = {}) {
  if (typeof window === "undefined") return;
  const payload: Record<string, string> = { event };
  const fields: Record<string, string | null | undefined> = {
    tratamiento: params.tratamiento ?? sessionStorage.getItem("luvania_tratamiento"),
    sede: params.sede ?? sessionStorage.getItem("luvania_sede"),
    origen: window.location.pathname,
    filtro: params.filtro,
    valor: params.valor,
    query: params.query,
  };
  for (const key of UTM) fields[key] = sessionStorage.getItem(key);
  for (const [key, value] of Object.entries(fields)) {
    if (PRIVATE_KEY.test(key)) continue;
    const next = clean(value);
    if (next) payload[key] = next;
  }
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
