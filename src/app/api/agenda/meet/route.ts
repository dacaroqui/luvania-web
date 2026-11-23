import { BookingError, bookMeet, googleConfig, googleSlots } from "@/lib/agenda/google";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const schema = z.object({
  requestId: z.uuid(),
  start: z.iso.datetime(),
  name: z.string().trim().min(2).max(80).regex(/^[^\r\n]+$/),
  phone: z.string().trim().regex(/^[0-9+ ()-]{7,20}$/).refine((value) => value.replace(/\D/g, "").length >= 7),
  email: z.email().max(160).optional(),
  consent: z.literal(true),
  website: z.literal("").optional(),
});

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

function errorReply(error: unknown) {
  return error instanceof BookingError
    ? reply({ error: error.message }, error.status)
    : reply({ error: "La agenda de Meet no está disponible temporalmente." }, 503);
}

export async function GET() {
  const config = googleConfig();
  if (!config) return reply({ enabled: false, slots: [] });
  try {
    return reply({ enabled: true, slots: await googleSlots(config) });
  } catch (error) {
    return errorReply(error);
  }
}

export async function POST(request: Request) {
  const config = googleConfig();
  if (!config) return reply({ error: "La agenda virtual aún no está disponible." }, 503);
  if (!request.headers.get("content-type")?.startsWith("application/json") || request.headers.get("sec-fetch-site") === "cross-site") {
    return reply({ error: "Solicitud inválida." }, 400);
  }
  const data = schema.safeParse(await request.json().catch(() => null));
  if (!data.success) return reply({ error: "Revisa tus datos de contacto." }, 400);
  try {
    const ip = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for") ?? "unknown";
    const result = await bookMeet(config, data.data, ip.split(",")[0].trim());
    return reply(result, result.status === "pending" ? 202 : 200);
  } catch (error) {
    return errorReply(error);
  }
}
