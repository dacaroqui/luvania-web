const INTERNAL =
  /sitio anterior|web anterior|p[aá]gina anterior|ficha anterior|men[uú] anterior|auditor[ií]a|por confirmar|discrepan|placeholder|r[oó]tulo anterior|digitaci[oó]n|gu[ií]a de marca|direcci[oó]n m[eé]dica|mal escrito|nombre correcto|no est[aá] publicada|2\s*[x×]\s*1|pendiente comercial|no se reproduce|no se publican|oferta vigente|como receta|slug |daba 404|letra de menos/i;

/** El marcador interno es TODO en mayúsculas. La palabra «todo» no se borra. */
const TODO_MARK = /(^|[^A-Za-zÁÉÍÓÚáéíóúñ])TODO([^A-Za-zÁÉÍÓÚáéíóúñ]|$)/;

export function isInternal(value: string) {
  return TODO_MARK.test(value) || INTERNAL.test(value);
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
