import { createHash } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const limit = 2_900_000;
const pngHeader = [137, 80, 78, 71, 13, 10, 26, 10];

function config() {
  const { OPENAI_API_KEY: apiKey, UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = process.env;
  if (process.env.VERCEL_ENV === "production" || process.env.LUVANIA_HAIR_AI_PREVIEW !== "true"
    || !apiKey || !redisUrl?.startsWith("https://") || !redisToken) return null;
  return { apiKey, redisUrl, redisToken };
}

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

async function validPng(file: FormDataEntryValue | null): Promise<File | null> {
  if (!(file instanceof File) || file.type !== "image/png" || file.size < 33 || file.size > limit) return null;
  const bytes = new Uint8Array(await file.slice(0, 24).arrayBuffer());
  if (!pngHeader.every((value, index) => bytes[index] === value)) return null;
  const dimensions = new DataView(bytes.buffer);
  return dimensions.getUint32(16) === 1024 && dimensions.getUint32(20) === 1024 ? file : null;
}

export async function GET() {
  return reply({ enabled: Boolean(config()) });
}

export async function POST(request: Request) {
  const settings = config();
  if (!settings) return reply({ error: "La simulación con IA aún no está habilitada." }, 503);
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data") || request.headers.get("sec-fetch-site") === "cross-site") {
    return reply({ error: "Solicitud inválida." }, 400);
  }
  if (Number(request.headers.get("content-length")) > limit) return reply({ error: "La captura es demasiado grande." }, 413);
  const data = await request.formData().catch(() => null);
  const style = data?.get("style");
  if (!data || data.get("consent") !== "true" || (style !== "masculino" && style !== "femenino")) {
    return reply({ error: "Hace falta autorizar el envío de la captura." }, 400);
  }
  const [image, mask] = await Promise.all([validPng(data.get("image")), validPng(data.get("mask"))]);
  if (!image || !mask || image.size + mask.size > limit) return reply({ error: "No se pudo procesar la captura." }, 400);

  try {
    const source = (request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0];
    const ip = createHash("sha256").update(source).digest("hex");
    const today = new Date().toISOString().slice(0, 10);
    const budget = await fetch(settings.redisUrl, {
      method: "POST",
      headers: { authorization: "Bearer " + settings.redisToken, "content-type": "application/json" },
      body: JSON.stringify(["EVAL",
        "local n=tonumber(redis.call('GET',KEYS[1]) or '0'); local d=tonumber(redis.call('GET',KEYS[2]) or '0'); if n>=3 or d>=20 then return 0 end; redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1],3600); redis.call('INCR',KEYS[2]); redis.call('EXPIRE',KEYS[2],86400); return 1",
        2, "luvania:hair:ip:" + ip, "luvania:hair:day:" + today]),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    const allowance = budget.ok ? await budget.json() as { result?: number } : null;
    if (allowance?.result === 0) return reply({ error: "La prueba alcanzó su límite. Vuelve más tarde." }, 429);
    if (allowance?.result !== 1) return reply({ error: "La simulación no está disponible temporalmente." }, 503);

    const form = new FormData();
    form.append("model", "gpt-image-2");
    form.append("image[]", image, "captura.png");
    form.append("mask", mask, "zona-capilar.png");
    form.append("size", "1024x1024");
    form.append("quality", "medium");
    form.append("output_format", "webp");
    form.append("output_compression", "88");
    form.append("prompt", "Edit only the masked scalp region in this single portrait. Keep exactly the same person, pose, face, skin, eyes, eyebrows, clothes, camera distance, lighting and background. Keep the original hair color, texture and length, with realistic individual strands. " + (style === "masculino"
      ? "Add visibly fuller but modest density around the receding temples and frontal hairline, adapting to their original short haircut. Use a natural, age-appropriate contour, no wig or change of haircut."
      : "Add visibly fuller roots and gently reduce visible scalp in the upper part of the hair, preserving the direction and length of the original hairstyle. Avoid a new hairstyle or extensions."));
    const result = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { authorization: "Bearer " + settings.apiKey },
      body: form,
      cache: "no-store",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(105000)]),
    });
    const payload = result.ok ? await result.json() as { data?: { b64_json?: string }[] } : null;
    const encoded = payload?.data?.[0]?.b64_json;
    if (!encoded || encoded.length > 4_500_000) return reply({ error: "No se pudo generar la vista previa. Intenta de nuevo." }, 502);
    return new Response(new Uint8Array(Buffer.from(encoded, "base64")), {
      headers: { "content-type": "image/webp", "cache-control": "no-store" },
    });
  } catch {
    return reply({ error: "No se pudo completar la simulación. Intenta de nuevo." }, 503);
  }
}
