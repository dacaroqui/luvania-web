import { sedes } from "@/data/sedes";
import { z } from "zod";

const slugs = sedes.map((sede) => sede.slug) as [string, ...string[]];

const leadSchema = z.object({
  nombre: z.string().trim().min(2).max(80),
  celular: z.string().trim().regex(/^[0-9+\s()-]{7,20}$/),
  sede: z.enum(slugs),
  tratamiento: z.string().trim().max(160).optional().or(z.literal("")),
  promo: z.string().trim().max(160).optional().or(z.literal("")),
  consentimiento: z.literal(true),
  website: z.string().max(0).optional().or(z.literal("")),
});

const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  // ponytail: límite en memoria de esta instancia. Para varias réplicas, pasar a un almacén compartido.
  return recent.length > 5;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return Response.json({ ok: false, error: "Demasiados envíos. Espera unos minutos." }, { status: 429 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Revisa los datos e inténtalo de nuevo." }, { status: 400 });
  }
  if (parsed.data.website) {
    return Response.json({ ok: true, delivered: false });
  }

  const payload = {
    nombre: parsed.data.nombre,
    celular: parsed.data.celular,
    sede: parsed.data.sede,
    tratamiento: parsed.data.tratamiento || "",
    promo: parsed.data.promo || "",
    origen: request.headers.get("referer") || "",
    at: new Date().toISOString(),
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    return Response.json({ ok: true, delivered: false });
  }

  const sent = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }).then((response) => response.ok).catch(() => false);

  if (!sent) {
    return Response.json({ ok: false, error: "No pudimos enviar tus datos. Prueba por WhatsApp." }, { status: 502 });
  }
  return Response.json({ ok: true, delivered: true });
}
