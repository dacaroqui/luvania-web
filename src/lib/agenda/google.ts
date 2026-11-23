import "server-only";

import { createHash, randomUUID } from "node:crypto";
import type { AgendaSlot } from "./provider";

const zone = "America/Bogota";
const minute = 60000;
const horizon = 14;
const calendarApi = "https://www.googleapis.com/calendar/v3";
const headers = { "content-type": "application/json" };

type Config = {
  calendar: string; clientId: string; secret: string; refresh: string;
  redisUrl: string; redisToken: string; days: number[]; duration: number;
};
type Interval = { start: string; end: string };
type Event = {
  hangoutLink?: string;
  status?: string;
  extendedProperties?: { private?: { booking?: string } };
  conferenceData?: {
    entryPoints?: { entryPointType: string; uri: string }[];
    createRequest?: { status?: { statusCode?: string } };
  };
};
export type MeetBooking = { requestId: string; start: string; name: string; phone: string; email?: string };

export class BookingError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export function googleConfig(): Config | null {
  const { GOOGLE_CALENDAR_ID: calendar, GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: secret,
    GOOGLE_REFRESH_TOKEN: refresh, UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = process.env;
  if (!calendar || !clientId || !secret || !refresh || !redisUrl?.startsWith("https://") || !redisToken) return null;
  const schedule = process.env.LUVANIA_MEET_WEEKDAYS || "1,2,3,4,5";
  if (!/^[0-6](,[0-6])*$/.test(schedule)) return null;
  const days = schedule.split(",").map(Number);
  const duration = Number(process.env.LUVANIA_MEET_DURATION || 30);
  if (![15, 20, 30, 45, 60].includes(duration)) return null;
  return { calendar, clientId, secret, refresh, redisUrl, redisToken, days, duration };
}

async function token(config: Config) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: config.clientId, client_secret: config.secret,
      refresh_token: config.refresh, grant_type: "refresh_token",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(7000),
  });
  const result = response.ok ? await response.json() as { access_token?: string } : null;
  if (!result?.access_token) throw new BookingError(503, "La agenda de Meet no está disponible.");
  return result.access_token;
}

function google(access: string, path: string, init?: RequestInit) {
  return fetch(calendarApi + path, {
    ...init,
    headers: { ...headers, authorization: "Bearer " + access },
    cache: "no-store",
    signal: AbortSignal.timeout(7500),
  });
}

function calendarPath(config: Config) {
  return "/calendars/" + encodeURIComponent(config.calendar) + "/events";
}

async function busy(config: Config, access: string, start: string, end: string) {
  const response = await google(access, "/freeBusy", {
    method: "POST", body: JSON.stringify({ timeMin: start, timeMax: end, timeZone: zone, items: [{ id: config.calendar }] }),
  });
  const result = response.ok ? await response.json() as { calendars?: Record<string, { busy?: Interval[]; errors?: unknown[] }> } : null;
  const state = result?.calendars?.[config.calendar];
  if (!state?.busy || state.errors?.length) throw new BookingError(503, "No pudimos consultar los horarios.");
  return state.busy;
}

function bogotaDate(value: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(value);
}

function candidates(config: Config, now: number): AgendaSlot[] {
  const today = Date.parse(bogotaDate(new Date(now)) + "T00:00:00Z");
  const dayFormat = new Intl.DateTimeFormat("es-CO", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" });
  const slots: AgendaSlot[] = [];
  for (let offset = 0; offset < horizon; offset += 1) {
    const date = new Date(today + offset * 86400000);
    if (!config.days.includes(date.getUTCDay())) continue;
    const day = date.toISOString().slice(0, 10);
    const opening = Date.parse(day + "T08:00:00-05:00");
    for (let elapsed = 0; elapsed + config.duration <= 9 * 60; elapsed += config.duration) {
      const start = opening + elapsed * minute;
      if (start < now + 15 * minute) continue;
      const iso = new Date(start).toISOString();
      const label = String(8 + Math.floor(elapsed / 60)).padStart(2, "0") + ":" + String(elapsed % 60).padStart(2, "0");
      slots.push({ id: iso, start: iso, end: new Date(start + config.duration * minute).toISOString(), day, dayLabel: dayFormat.format(date), label });
    }
  }
  return slots;
}

function overlaps(slot: AgendaSlot, unavailable: Interval[]) {
  return unavailable.some((item) => Date.parse(slot.start) < Date.parse(item.end) && Date.parse(slot.end) > Date.parse(item.start));
}

export async function googleSlots(config: Config) {
  const slots = candidates(config, Date.now());
  const first = slots[0];
  const last = slots.at(-1);
  if (!first || !last) return [];
  const unavailable = await busy(config, await token(config), first.start, last.end);
  return slots.filter((slot) => !overlaps(slot, unavailable));
}

async function redis(config: Config, command: unknown[]) {
  const response = await fetch(config.redisUrl, {
    method: "POST",
    headers: { ...headers, authorization: "Bearer " + config.redisToken },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(4500),
  });
  const result = response.ok ? await response.json() as { result?: unknown; error?: string } : null;
  if (!result || result.error) throw new BookingError(503, "La agenda no está disponible temporalmente.");
  return result.result;
}

function meetLink(event: Event) {
  const link = event.conferenceData?.entryPoints?.find((item) => item.entryPointType === "video")?.uri ?? event.hangoutLink;
  if (!link) return null;
  try {
    const url = new URL(link);
    return url.protocol === "https:" && url.hostname === "meet.google.com" ? url.href : null;
  } catch {
    return null;
  }
}

export async function bookMeet(config: Config, input: MeetBooking, source: string) {
  const throttle = createHash("sha256").update(source).digest("hex");
  const count = await redis(config, ["EVAL",
    "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],600) end; return n",
    1, "luvania:meet:attempt:" + throttle]);
  if (typeof count !== "number" || count > 25) throw new BookingError(429, "Espera unos minutos antes de volver a intentarlo.");

  const date = new Date(input.start).toISOString();
  const identifier = createHash("sha256").update(config.calendar + ":" + date).digest("hex");
  const key = "luvania:meet:slot:" + identifier;
  const owner = randomUUID();
  const lock = await redis(config, ["SET", key, owner, "NX", "EX", 90]);
  if (lock !== "OK") throw new BookingError(409, "Estamos procesando ese horario. Intenta de nuevo en unos segundos.");

  try {
    const access = await token(config);
    const path = calendarPath(config);
    const existing = await google(access, path + "/" + identifier);
    let event: Event;
    if (existing.ok) {
      event = await existing.json() as Event;
      if (event.status === "cancelled" || event.extendedProperties?.private?.booking !== input.requestId) {
        throw new BookingError(409, "Ese horario ya no está disponible. Elige otro.");
      }
    } else {
      if (existing.status !== 404) throw new BookingError(503, "No pudimos verificar la reserva.");
      const slot = candidates(config, Date.now()).find((item) => item.start === date);
      if (!slot || overlaps(slot, await busy(config, access, slot.start, slot.end))) {
        throw new BookingError(409, "Ese horario ya no está disponible. Elige otro.");
      }
      const created = await google(access, path + "?conferenceDataVersion=1&sendUpdates=all", {
        method: "POST",
        body: JSON.stringify({
          id: identifier,
          summary: "Valoración virtual · Luvania",
          description: "Nombre: " + input.name + "\nContacto: " + input.phone,
          visibility: "private",
          start: { dateTime: slot.start, timeZone: zone },
          end: { dateTime: slot.end, timeZone: zone },
          attendees: input.email ? [{ email: input.email }] : undefined,
          guestsCanInviteOthers: false,
          guestsCanSeeOtherGuests: false,
          extendedProperties: { private: { booking: input.requestId } },
          conferenceData: { createRequest: { requestId: input.requestId, conferenceSolutionKey: { type: "hangoutsMeet" } } },
        }),
      });
      if (created.status === 409) throw new BookingError(409, "Ese horario ya no está disponible. Elige otro.");
      if (!created.ok) throw new BookingError(503, "No pudimos confirmar la reserva. Intenta nuevamente.");
      event = await created.json() as Event;
    }
    const url = meetLink(event);
    if (!url && event.conferenceData?.createRequest?.status?.statusCode === "failure") {
      const retried = await google(access, path + "/" + identifier + "?conferenceDataVersion=1&sendUpdates=all", {
        method: "PATCH",
        body: JSON.stringify({ conferenceData: { createRequest: {
          requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" },
        } } }),
      });
      if (!retried.ok) throw new BookingError(503, "Google no pudo crear el enlace. Consulta de nuevo el mismo horario.");
      const recovered = meetLink(await retried.json() as Event);
      if (recovered) return { status: "confirmed" as const, url: recovered };
    }
    return url ? { status: "confirmed" as const, url } : { status: "pending" as const };
  } finally {
    await redis(config, ["EVAL", "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end; return 0", 1, key, owner]).catch(() => undefined);
  }
}
