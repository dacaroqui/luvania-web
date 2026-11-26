"use client";

import type { ExtraNeed } from "@/data/landings/types";
import type { AgendaSlot } from "@/lib/agenda/provider";
import { needById } from "@/data/taxonomy";
import { needPages } from "@/lib/hubs";
import { agendaLink } from "@/lib/whatsapp";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseButton } from "../close-button";

type Modality = "presencial" | "virtual" | "hibrida";
type Sede = { slug: string; name: string; whatsapp: string };

const steps = ["¿Qué quieres mejorar?", "Elige tu valoración", "Tus datos de contacto"];
const modalities = [
  { id: "presencial", name: "Presencial", description: "En una sede" },
  { id: "virtual", name: "Virtual", description: "Por Google Meet" },
  { id: "hibrida", name: "Híbrida", description: "En sede y por video" },
] as const;

export function ValuationWizard({ needId, extras, sedes, origin, promo, initialSede, onClose }: {
  needId: string;
  extras: ExtraNeed[];
  sedes: Sede[];
  origin: { id: string; name: string } | null;
  promo?: string;
  initialSede: string | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState(() => needPages.some((item) => item.slug === needId) || needById(needId) ? needId : "");
  const [other, setOther] = useState("");
  const [modality, setModality] = useState<Modality | null>(null);
  const [sede, setSede] = useState(initialSede ?? "");
  const [availability, setAvailability] = useState<"loading" | "ready" | "unavailable">("loading");
  const [slots, setSlots] = useState<AgendaSlot[]>([]);
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState<AgendaSlot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [meetPending, setMeetPending] = useState(false);
  const [result, setResult] = useState<{ meet?: string; whatsapp?: string; delivered?: boolean }>();
  const request = useRef<{ start: string; id: string } | null>(null);
  const busy = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const chosen = sedes.find((item) => item.slug === sede);
  const primary = needPages.find((item) => item.slug === needId) ?? needById(needId);
  const choices = [...(primary ? [{ id: needId, name: primary.name }] : []), ...extras.filter((item) => item.id !== needId)];
  const needName = need === "otra" ? other.trim() : choices.find((choice) => choice.id === need)?.name ?? "";
  const days = [...new Set(slots.map((item) => item.day))];

  useEffect(() => {
    if (step !== 1 || modality !== "virtual") return;
    const controller = new AbortController();
    void fetch("/api/agenda/meet", { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("agenda");
      const data = await response.json() as { enabled: boolean; slots: AgendaSlot[] };
      if (controller.signal.aborted) return;
      setAvailability(data.enabled ? "ready" : "unavailable");
      setSlots(data.slots);
      setDay((current) => data.slots.some((item) => item.day === current) ? current : data.slots[0]?.day ?? "");
      setSlot((current) => data.slots.find((item) => item.id === current?.id) ?? null);
    }).catch(() => {
      if (!controller.signal.aborted) setAvailability("unavailable");
    });
    return () => controller.abort();
  }, [modality, step]);

  function move(next: number) {
    setError("");
    if (next === 1 && modality === "virtual") setAvailability("loading");
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  }

  function next() {
    if (step === 0 && ((!origin && !need) || (need === "otra" && !other.trim()))) {
      setError(need === "otra" ? "Cuéntanos qué quieres mejorar." : "Elige qué quieres mejorar.");
    } else if (step === 1 && (!modality || (modality === "virtual" ? availability !== "ready" || !slot : !chosen))) {
      setError(!modality ? "Elige una modalidad." : modality === "virtual" ? "Elige un día y una hora disponible." : "Elige una sede.");
    } else move(step + 1);
  }

  async function finish() {
    if (busy.current || !modality) return;
    if (name.trim().length < 2 || !/^[0-9+ ()-]{7,20}$/.test(phone.trim()) || phone.replace(/\D/g, "").length < 7) {
      setError("Revisa tu nombre y número de celular.");
      return;
    }
    if (modality === "virtual" && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Revisa el correo o déjalo vacío.");
      return;
    }
    if (!consent) {
      setError("Autoriza que te contactemos para continuar.");
      return;
    }
    if (modality === "virtual" ? !slot : !chosen) return;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      if (modality === "virtual" && slot) {
        const id = request.current?.start === slot.start ? request.current.id : crypto.randomUUID();
        request.current = { start: slot.start, id };
        const response = await fetch("/api/agenda/meet", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ requestId: id, start: slot.start, name: name.trim(), phone: phone.trim(), email: email.trim() || undefined, consent, website }),
        });
        const payload = await response.json() as { status?: string; url?: string; error?: string };
        if (response.ok && payload.status === "confirmed" && payload.url) {
          setResult({ meet: payload.url });
          requestAnimationFrame(() => heading.current?.focus());
        } else if (response.status === 202) {
          setMeetPending(true);
          setError("Estamos preparando tu enlace de Meet. Consulta el enlace en unos segundos.");
        } else setError(payload.error || "No pudimos confirmar tu cita. Intenta de nuevo.");
      } else if (chosen) {
        const treatment = origin?.name || needName || "una valoración";
        const whatsapp = agendaLink({
          sede: chosen.name, whatsapp: chosen.whatsapp, tratamiento: [treatment, promo ? "Promoción: " + promo : "", "Modalidad: " + modality, "Mi nombre es " + name.trim(), "Mi celular es " + phone.trim()].filter(Boolean).join(". "),
          url: window.location.href,
        });
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ nombre: name.trim(), celular: phone.trim(), sede: chosen.slug, tratamiento: treatment.slice(0, 160), promo: promo ?? "", consentimiento: true, website, modalidad: modality, necesidad: needName.slice(0, 160) }),
        });
        const payload = await response.json() as { delivered?: boolean; error?: string };
        setResult({ delivered: Boolean(response.ok && payload.delivered), whatsapp });
        requestAnimationFrame(() => heading.current?.focus());
      }
    } catch {
      setError("No pudimos completar la solicitud. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  const calendarUrl = result?.meet && slot ? "https://calendar.google.com/calendar/render?" + new URLSearchParams({
    action: "TEMPLATE", text: "Valoración virtual con Luvania",
    dates: [slot.start, slot.end].map((value) => new Date(value).toISOString().replace(/[-:]|\.\d{3}/g, "")).join("/"),
    location: result.meet,
  }) : undefined;

  return (
    <div className="vx is-dialog">
      <div className="vx-main">
        <header className="vx-top">
          <p>Valoración personalizada</p>
          <div className="vx-top-end"><p>Paso {step + 1} de {steps.length}</p><CloseButton onClick={onClose} /></div>
        </header>
        <div className="vx-progress" aria-hidden="true">{steps.map((title, index) => <span key={title} className={index <= step ? "is-done" : ""} />)}</div>
        <div className="vx-heading">
          <h3 ref={heading} tabIndex={-1} className="display">{result ? result.meet ? "Valoración confirmada" : result.delivered ? "Solicitud enviada" : "Confirma tu solicitud por WhatsApp" : steps[step]}</h3>
        </div>
        <div className="vx-scroll">
          <div className="vx-step">
            {result ? (
              <div className="vx-availability">
                {result.meet && slot ? <p>{slot.dayLabel} · {slot.label}, hora de Colombia</p> : chosen ? <p>Sede {chosen.name}. El equipo te confirma la disponibilidad.</p> : null}
                {result.meet ? <a className="btn-coral w-fit" href={result.meet} target="_blank" rel="noreferrer">Entrar a Google Meet</a> : null}
                {calendarUrl && !email.trim() ? <a className="btn-line w-fit" href={calendarUrl} target="_blank" rel="noreferrer">Añadir a Google Calendar</a> : null}
                {result.meet && email.trim() ? <p>Enviamos la invitación de calendario a {email.trim()}.</p> : null}
                {result.whatsapp ? <a className="btn-coral w-fit" href={result.whatsapp} target="_blank" rel="noreferrer">Abrir WhatsApp</a> : null}
              </div>
            ) : null}

            {!result && step === 0 ? (
              <>
                {origin ? <p className="vx-treatment-choice"><span>Tratamiento</span><strong>{origin.name}</strong></p> : null}
                <label className="vx-field">
                  {origin ? "¿Hay algo más que quieras revisar? (opcional)" : "Selecciona tu necesidad"}
                  <select value={need} onChange={(event) => { setNeed(event.target.value); setError(""); }}>
                    <option value="">{origin ? "Solo el tratamiento seleccionado" : "Elige una opción"}</option>
                    {choices.map((choice) => <option key={choice.id} value={choice.id}>{choice.name}</option>)}
                    <option value="otra">Otra necesidad</option>
                  </select>
                </label>
                {need === "otra" ? <label className="vx-field">Cuéntanos qué quieres mejorar<input maxLength={160} value={other} onChange={(event) => setOther(event.target.value)} /></label> : null}
              </>
            ) : null}

            {!result && step === 1 ? (
              <div className="vx-appointment">
                <div className="vx-cards vx-modalities" role="group" aria-label="Modalidad">
                  {modalities.map((item) => (
                    <button key={item.id} type="button" className={modality === item.id ? "is-on" : ""} aria-pressed={modality === item.id} onClick={() => {
                      if (modality !== item.id && item.id === "virtual") setAvailability("loading");
                      setModality(item.id);
                      setError("");
                    }}><strong>{item.name}</strong><span>{item.description}</span></button>
                  ))}
                </div>
                {modality && modality !== "virtual" ? (
                  <fieldset className="vx-field">
                    <legend>Sede de tu valoración</legend>
                    <div className="vx-chips">
                      {sedes.map((item) => <button key={item.slug} type="button" className={sede === item.slug ? "is-on" : ""} aria-pressed={sede === item.slug} onClick={() => { setSede(item.slug); setError(""); }}>{item.name}</button>)}
                    </div>
                    <p className="text-sm text-mute">La sede te confirma sus horarios por WhatsApp.</p>
                  </fieldset>
                ) : null}
                {modality === "virtual" ? (
                  availability === "loading" ? <p role="status">Consultando horarios…</p> :
                  availability === "unavailable" ? <p>La agenda virtual está temporalmente fuera de servicio. Puedes elegir una sede.</p> :
                  !days.length ? <p>No hay cupos virtuales disponibles en los próximos días.</p> : (
                    <div className="vx-availability">
                      <p className="font-bold">Horarios disponibles · Colombia</p>
                      <div className="vx-contact">
                        <label className="vx-field">Día<select value={day} onChange={(event) => { setDay(event.target.value); setSlot(null); setError(""); }}>
                          {days.map((value) => <option key={value} value={value}>{slots.find((item) => item.day === value)?.dayLabel}</option>)}
                        </select></label>
                        <label className="vx-field">Hora<select value={slot?.id ?? ""} onChange={(event) => { setSlot(slots.find((item) => item.id === event.target.value && item.day === day) ?? null); setError(""); }}>
                          <option value="">Elige una hora</option>
                          {slots.filter((item) => item.day === day).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                        </select></label>
                      </div>
                    </div>
                  )
                ) : null}
              </div>
            ) : null}

            {!result && step === 2 ? (
              <>
                <p className="agenda-summary">{[origin?.name || needName, promo, modality === "virtual" ? slot?.dayLabel + " · " + slot?.label : chosen?.name].filter(Boolean).join(" · ")}</p>
                <div className="vx-contact">
                  <label className="vx-field">Nombre completo<input autoComplete="name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>
                  <label className="vx-field">Celular<input autoComplete="tel" inputMode="tel" maxLength={20} value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
                  {modality === "virtual" ? <label className="vx-field">Correo (opcional)<input autoComplete="email" inputMode="email" maxLength={160} value={email} onChange={(event) => setEmail(event.target.value)} /></label> : null}
                </div>
                <label className="vx-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Autorizo que Luvania me contacte sobre esta valoración según la <Link href="/politicas/datos-personales">política de datos</Link>.</span></label>
                <label className="absolute -left-[9999px]" aria-hidden="true">Sitio web<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
              </>
            ) : null}
            {error ? <p className="vx-error" role="alert">{error}</p> : null}
          </div>
        </div>
        {!result ? <div className="vx-nav">
          {step > 0 ? <button type="button" className="btn-line" disabled={pending || meetPending} onClick={() => move(step - 1)}>Volver</button> : <span />}
          {step < 2 ? <button type="button" className="btn-coral" onClick={next}>Continuar</button> :
            <button type="button" className="btn-coral" disabled={pending} onClick={finish}>{pending ? "Enviando…" : meetPending ? "Consultar enlace" : modality === "virtual" ? "Confirmar valoración" : "Enviar solicitud"}</button>}
        </div> : null}
      </div>
    </div>
  );
}
