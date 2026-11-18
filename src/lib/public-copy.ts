const INTERNAL =
  /TODO|sitio anterior|web anterior|p[aá]gina anterior|ficha anterior|men[uú] anterior|auditor[ií]a|por confirmar|discrepan|placeholder|r[oó]tulo anterior|digitaci[oó]n|gu[ií]a de marca|direcci[oó]n m[eé]dica/i;

export function isInternal(value: string) {
  return INTERNAL.test(value);
}

/** Quita frases de trabajo interno. El dato original se queda en los archivos. */
export function publicText(value: string | undefined, fallback = "") {
  if (!value) return fallback;
  const kept = value
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part && !isInternal(part));
  return kept.join(" ").replace(/\s+/g, " ").trim() || fallback;
}
