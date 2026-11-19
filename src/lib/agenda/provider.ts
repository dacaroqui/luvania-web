export type AgendaModality = "presencial" | "virtual" | "hibrida";

export type AgendaQuery = {
  modality: AgendaModality;
  sede?: string | null;
  days?: number;
};

export type AgendaSlot = {
  id: string;
  start: string;
  end: string;
  label: string;
  day: string;
  dayLabel: string;
};

export type MeetStatus = {
  provider: "google-meet";
  url: null;
  status: "pendiente";
};

export type AgendaReservation = {
  reservationId: string;
  slotId: string;
  meet: MeetStatus | null;
};

export interface AgendaProvider {
  getSlots(query: AgendaQuery): Promise<AgendaSlot[]>;
  reserve(slot: AgendaSlot, channel: "sede" | "meet"): Promise<AgendaReservation>;
}

const TIMES = ["10:00", "11:30", "15:00", "16:30"];

function bogotaToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function shiftDate(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function weekday(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Cupos de ejemplo. `enabled` es falso en producción: no se publican horarios inventados. */
export function createMockAgenda(enabled: boolean): AgendaProvider {
  return {
    async getSlots(query) {
      if (!enabled) return [];
      const start = bogotaToday();
      const slots: AgendaSlot[] = [];
      for (let offset = 1; slots.length < (query.days ?? 5) * TIMES.length && offset < 14; offset += 1) {
        const day = shiftDate(start, offset);
        if (weekday(day) === 0) continue;
        const dayLabel = new Intl.DateTimeFormat("es-CO", {
          weekday: "short",
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        }).format(new Date(`${day}T00:00:00Z`));
        for (const time of TIMES) {
          const [hour, minute] = time.split(":").map(Number);
          const endHour = minute === 30 ? hour + 1 : hour;
          const endMinute = minute === 30 ? 0 : 30;
          const end = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
          slots.push({
            id: `${day}T${time}-${query.modality}-${query.sede ?? "sin-sede"}`,
            start: `${day}T${time}:00-05:00`,
            end: `${day}T${end}:00-05:00`,
            label: time,
            day,
            dayLabel,
          });
        }
        if (new Set(slots.map((slot) => slot.day)).size >= (query.days ?? 5)) break;
      }
      return slots;
    },
    async reserve(slot, channel) {
      if (!enabled) throw new Error("agenda-no-conectada");
      return {
        reservationId: `ejemplo-${slot.id}`,
        slotId: slot.id,
        meet: channel === "meet" ? { provider: "google-meet", url: null, status: "pendiente" } : null,
      };
    },
  };
}
