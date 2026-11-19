export type CrmAnswer = {
  id: string;
  pregunta: string;
  opciones: string[];
  texto: string;
};

export type CrmNeed = {
  id: string;
  principal: boolean;
  respuestas: CrmAnswer[];
};

export type CrmPayload = {
  paciente: { nombre: string; celular: string; email: string | null };
  fuente: { utm_source: string | null; utm_campaign: string | null; path: string };
  necesidad: string;
  necesidades: CrmNeed[];
  modalidad: { tipo: "presencial" | "virtual" | "hibrida"; virtual: "ahora" | "agendar" | null };
  slot: { id: string; start: string; end: string; reservationId: string } | null;
  sede: string | null;
  upsell: { accepted: boolean; pay: null; receive: null } | null;
  pago: { status: "no-disponible"; amount: null; currency: "COP" };
};

export type CrmSubmitResult = { ok: true; mocked: true } | { ok: false; reason: "crm-no-conectado" };

/**
 * Vista previa: deja el payload en la consola. No hay red.
 * Producción: no registra datos personales.
 */
export function submitCrmLead(payload: CrmPayload): CrmSubmitResult {
  if (process.env.VERCEL_ENV === "production") return { ok: false, reason: "crm-no-conectado" };
  console.info("[luvania-crm-mock]", payload);
  return { ok: true, mocked: true };
}
