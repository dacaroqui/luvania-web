"use client";

import caidaLanding from "@/data/landings/caida-del-cabello";
import type { ExtraNeed, LandingQuestion } from "@/data/landings/types";
import { needPages } from "@/lib/hubs";
import { createMockAgenda, type AgendaSlot } from "@/lib/agenda/provider";
import { agendaLink } from "@/lib/whatsapp";
import { submitCrmLead, type CrmAnswer } from "@/lib/crm-lead";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CloseButton } from "../close-button";

type Answer = { opciones: string[]; texto: string };
type Modality = "presencial" | "virtual" | "hibrida";
type Sede = { slug: string; name: string; whatsapp?: string };

const empty = (): Answer => ({ opciones: [], texto: "" });

const ANTES: LandingQuestion = {
  id: "antes",
  prompt: "¿Has probado algo antes?",
  choices: [
    { id: "primera", label: "No, sería mi primera vez" },
    { id: "cabina", label: "Sí, tratamientos en cabina" },
    { id: "productos", label: "Sí, productos o suplementos" },
  ],
};

const ZONA: LandingQuestion = {
  id: "zona-general",
  prompt: "¿En qué zona deseas enfocarte?",
  choices: [
    { id: "rostro", label: "Rostro" },
    { id: "cuerpo", label: "Cuerpo" },
    { id: "cabello", label: "Cabello" },
    { id: "no-se", label: "No lo sé" },
  ],
};

const STEPS = [
  { title: "¿Qué quieres mejorar?", photo: "/stock/hero.webp" },
  { title: "Tu experiencia", photo: "/stock/faciales.webp" },
  { title: "¿Cómo prefieres tu valoración?", photo: "/stock/experiencia.webp" },
  { title: "¿Cómo te contactamos?", photo: "/stock/wellness.webp" },
];

const modalities = [
  { id: "presencial", title: "Presencial", description: "En una sede", icon: "M4 20V7l8-4 8 4v13M3 20h18M10 20v-5h4v5M8 10h1m6 0h1" },
  { id: "virtual", title: "Virtual", description: "Por videollamada", icon: "M4 7h11v10H4zM15 10l5-3v10l-5-3" },
  { id: "hibrida", title: "Híbrida", description: "En sede y por video", icon: "M4 8h15m-4-4 4 4-4 4M20 16H5m4-4-4 4 4 4" },
] as const;

export function ValuationWizard({
  preview,
  needId,
  path,
  questions,
  extras,
  sedes,
  frame = "page",
  origin = null,
  promo,
  initialSede = null,
  deliverWhatsapp = false,
  onClose,
}: {
  preview: boolean;
  needId: string;
  path: string;
  questions: LandingQuestion[];
  extras: ExtraNeed[];
  sedes: Sede[];
  frame?: "page" | "dialog";
  origin?: { id: string; name: string } | null;
  promo?: string;
  initialSede?: string | null;
  deliverWhatsapp?: boolean;
  onClose?: () => void;
}) {
  const agenda = useMemo(() => createMockAgenda(preview), [preview]);
  const scrollArea = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [appointmentDetails, setAppointmentDetails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [patient, setPatient] = useState({ nombre: "", celular: "", email: "" });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [picked, setPicked] = useState<string[]>(() => (needPages.some((need) => need.slug === needId) ? [needId] : []));
  const [otra, setOtra] = useState("");
  const [modality, setModality] = useState<Modality | null>(null);
  const [sede, setSede] = useState<string | null>(initialSede);
  const [slots, setSlots] = useState<AgendaSlot[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<AgendaSlot | null>(null);
  const [meetState, setMeetState] = useState<"loading" | "ready" | "unavailable">("loading");
  const [meetUrl, setMeetUrl] = useState("");
  const [meetPending, setMeetPending] = useState(false);
  const meetRequest = useRef<{ start: string; id: string } | null>(null);
  const bookingInFlight = useRef(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [phase, setPhase] = useState<"form" | "recibida">("form");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [utm, setUtm] = useState({ source: null as string | null, campaign: null as string | null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({ source: params.get("utm_source"), campaign: params.get("utm_campaign") });
  }, []);

  useEffect(() => {
    if (step !== 2 || !modality) return;
    let live = true;
    const controller = new AbortController();
    function showSlots(next: AgendaSlot[]) {
      if (!live) return;
      setSlots(next);
      setDay((current) => next.some((item) => item.day === current) ? current : next[0]?.day ?? null);
      setSlot((current) => next.find((item) => item.id === current?.id) ?? null);
    }
    if (modality === "virtual") {
      setMeetState("loading");
      void fetch("/api/agenda/meet", { signal: controller.signal }).then(async (response) => {
        if (!response.ok) throw new Error("agenda");
        const data = await response.json() as { enabled: boolean; slots: AgendaSlot[] };
        if (!live) return;
        setMeetState(data.enabled ? "ready" : "unavailable");
        showSlots(data.slots);
      }).catch(() => {
        if (live) { setMeetState("unavailable"); showSlots([]); }
      });
    } else {
      void agenda.getSlots({ modality, sede, days: 5 }).then(showSlots);
    }
    return () => {
      live = false;
      controller.abort();
    };
  }, [agenda, modality, sede, step]);

  const provided = questions.length ? questions : caidaLanding.questions;
  const bank = [...provided];
  for (const question of caidaLanding.questions) {
    if (!bank.some((item) => item.id === question.id)) bank.push(question);
  }
  const byId = (id: string) => bank.find((item) => item.id === id);
  const answerOf = (id: string) => answers[id] ?? empty();
  const chooseOne = (question: LandingQuestion, label: string) => {
    setAnswers({ ...answers, [question.id]: { ...answerOf(question.id), opciones: [label] } });
    setErrors((current) => ({ ...current, [question.id]: "" }));
  };
  const toggleMany = (question: LandingQuestion, label: string) => {
    const current = answerOf(question.id);
    const opciones = current.opciones.includes(label)
      ? current.opciones.filter((item) => item !== label)
      : [...current.opciones, label];
    setAnswers({ ...answers, [question.id]: { ...current, opciones } });
    setErrors((currentErrors) => ({ ...currentErrors, [question.id]: "" }));
  };

  const needsSede = modality === "presencial" || modality === "hibrida";
  const wantsSlot = modality !== null;
  const hairDetail = picked.includes("caida-cabello") || answerOf("zona-general").opciones.includes("Cabello");
  const days = [...new Set(slots.map((item) => item.day))];
  const cards = [
    ...needPages.filter((need) => need.slug === needId || extras.some((item) => item.id === need.slug)),
  ];

  function validate(index: number) {
    const next: Record<string, string> = {};
    if (index === 0) {
      if (picked.length === 0 && !otra.trim()) next.mejorar = "Elige al menos una necesidad.";
      if (picked.includes("otra") && !otra.trim()) next.otra = "Cuéntanos esa otra necesidad.";
      if (!(needId === "caida-cabello" && picked.includes(needId)) && !answerOf("zona-general").opciones.length) next["zona-general"] = "Elige una zona.";
      if (hairDetail && byId("zona") && !answerOf("zona").opciones.length) next.zona = "Elige la zona del cuero.";
      if (!answerOf("desde-cuando").opciones.length) next["desde-cuando"] = "Elige hace cuánto lo notas.";
    }
    if (index === 1) {
      if (!answerOf("antes").opciones.length) next.antes = "Elige una opción.";
      if (!answerOf("cuando").opciones.length) next.cuando = "Elige un momento.";
    }
    if (index === 2) {
      if (!modality) next.modalidad = "Elige cómo quieres la valoración.";
      if (modality === "virtual" && (meetState !== "ready" || !slot)) next.horario = "Elige un horario disponible para continuar.";
      if (needsSede && !sede) next.sede = "Elige una sede.";
      if (modality !== "virtual" && preview && wantsSlot && slots.length > 0 && !slot) next.horario = "Elige un horario de ejemplo, o espera la confirmación.";
    }
    if (index === 3) {
      if (patient.nombre.trim().length < 2) next.nombre = "Escribe tu nombre.";
      if (patient.celular.replace(/\D/g, "").length < 7) next.celular = "Escribe un celular de al menos 7 dígitos.";
      if (modality === "virtual" && patient.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email.trim())) next.email = "Revisa el correo o déjalo vacío.";
      if (!consent) next.consentimiento = "Hace falta la autorización para contactarte.";
    }
    setErrors(next);
    return Object.values(next).every((value) => !value);
  }

  function go(nextStep: number) {
    if (scrollArea.current) scrollArea.current.scrollTop = 0;
    setAppointmentDetails(false);
    setStep(nextStep);
    setErrors({});
  }

  function pack(question: LandingQuestion, value: Answer | undefined): CrmAnswer {
    const current = value ?? empty();
    return { id: question.id, pregunta: question.prompt, opciones: current.opciones, texto: current.texto.trim() };
  }

  async function finishMeet(selected: AgendaSlot) {
    if (bookingInFlight.current) return;
    bookingInFlight.current = true;
    setPending(true);
    setNote("");
    const previous = meetRequest.current;
    const id = previous?.start === selected.start ? previous.id : crypto.randomUUID();
    meetRequest.current = { start: selected.start, id };
    try {
      const response = await fetch("/api/agenda/meet", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          requestId: id, start: selected.start, name: patient.nombre.trim(), phone: patient.celular.trim(),
          email: patient.email.trim() || undefined, consent, website,
        }),
      });
      const result = await response.json() as { status?: string; url?: string; error?: string };
      if (response.ok && result.status === "confirmed" && result.url) {
        setMeetUrl(result.url);
        setMeetPending(false);
        if (scrollArea.current) scrollArea.current.scrollTop = 0;
        setPhase("recibida");
      } else if (response.status === 202) {
        setMeetPending(true);
        setNote("Estamos preparando tu enlace de Meet. Pulsa «Consultar enlace» en unos segundos.");
      } else {
        setNote(result.error || "No pudimos confirmar la cita. Intenta de nuevo.");
      }
    } catch {
      setNote("No pudimos comprobar la reserva. Intenta de nuevo con el mismo horario.");
    } finally {
      bookingInFlight.current = false;
      setPending(false);
    }
  }

  async function finish() {
    if (pending || !validate(3) || !modality) return;
    if (modality === "virtual") {
      if (slot) await finishMeet(slot);
      return;
    }
    setPending(true);
    setNote("");
    let reserved = reservationId;
    if (preview && slot && wantsSlot) {
      try {
        const channel = modality === "presencial" ? "sede" : "meet";
        const result = await agenda.reserve(slot, channel);
        reserved = result.reservationId;
        setReservationId(result.reservationId);
      } catch {
        reserved = null;
      }
    }
    const shared = [ZONA, ANTES, ...bank].filter((question, index, list) => list.findIndex((item) => item.id === question.id) === index);
    const confirmed = Boolean(reserved && !reserved.startsWith("ejemplo-"));
    const crm = submitCrmLead({
      paciente: { nombre: patient.nombre.trim(), celular: patient.celular.trim(), email: patient.email.trim() || null },
      fuente: { utm_source: utm.source, utm_campaign: utm.campaign, path },
      necesidad: needId,
      origen: origin,
      confirmacion: confirmed ? "cita-confirmada" : "solicitud-recibida",
      necesidades: [
        {
          id: needId,
          principal: true,
          respuestas: [
            ...shared.map((question) => pack(question, answers[question.id])),
            ...(otra.trim() ? [{ id: "otra", pregunta: "Otra necesidad", opciones: [], texto: otra.trim() }] : []),
          ],
        },
        ...picked.flatMap((id) => {
          if (id === needId) return [];
          const need = extras.find((item) => item.id === id);
          if (!need) return [];
          return [{ id, principal: false, respuestas: [] }];
        }),
      ],
      modalidad: { tipo: modality, virtual: null },
      slot: slot && reserved ? { id: slot.id, start: slot.start, end: slot.end, reservationId: reserved } : null,
      sede: needsSede ? sede : null,
      upsell: null,
      pago: { status: "no-disponible", amount: null, currency: "COP" },
    });
    const chosen = sedes.find((item) => item.slug === sede);
    if (deliverWhatsapp && chosen?.whatsapp) {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: patient.nombre.trim(),
          celular: patient.celular.trim(),
          sede: chosen.slug,
          tratamiento: origin?.name || needId,
          promo: promo ?? "",
          consentimiento: true,
          website,
        }),
      });
      setPending(false);
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setNote(payload?.error || "No pudimos enviar tus datos. Inténtalo de nuevo.");
        return;
      }
      window.open(
        agendaLink({
          sede: chosen.name,
          whatsapp: chosen.whatsapp,
          tratamiento: `${origin?.name || "una valoración"}. Me llamo ${patient.nombre.trim()}. Celular ${patient.celular.trim()}`,
          url: window.location.href,
        }),
        "_blank",
        "noopener,noreferrer",
      );
    } else {
      setPending(false);
    }
    setNote(
      crm.ok
        ? "Quedó en la consola de este navegador. No se envió a un servicio."
        : "El envío al CRM aún no está conectado. No guardamos estos datos.",
    );
    setPhase("recibida");
  }

  const summary = [
    ["Necesidad", cards.filter((item) => picked.includes(item.slug)).map((item) => item.name).concat(otra.trim() ? [otra.trim()] : []).join(", ")],
    ["Zona", answerOf("zona-general").opciones.join(", ")],
    ["Preferencias", [answerOf("antes").opciones[0], answerOf("cuando").opciones[0]].filter(Boolean).join(" · ")],
    ["Sede", sedes.find((item) => item.slug === sede)?.name ?? ""],
    ["Modalidad", modalities.find((item) => item.id === modality)?.title ?? ""],
    ["Origen", origin ? `${origin.name} (${origin.id})` : ""],
    ["Horario", slot ? `${slot.dayLabel} ${slot.label}${preview && modality !== "virtual" ? " · ejemplo, sin confirmar" : " · hora Colombia"}` : preview ? "" : "Te confirmaremos la disponibilidad"],
  ].filter(([, value]) => value);

  const shell = (
    <div className={`vx ${frame === "dialog" ? "is-dialog" : ""}`}>
      <aside className="vx-side">
        {/* provisional: stock */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STEPS[step].photo} alt="" />
      </aside>
      <div className="vx-main">
        <header className="vx-top">
          <p>Valoración personalizada</p>
          <div className="vx-top-end">
            <p>0{step + 1} / 04</p>
            {frame === "dialog" && onClose ? <CloseButton onClick={onClose} /> : null}
          </div>
        </header>
        <div className="vx-progress" aria-hidden="true">
          {STEPS.map((item, index) => (
            <span key={item.title} className={index <= step ? "is-done" : ""} />
          ))}
        </div>
        <div className="vx-heading">
          <h3 className="display">{phase === "recibida" ? (meetUrl ? "Valoración confirmada" : "Solicitud recibida") : step === 2 && appointmentDetails ? "Elige los detalles de tu cita" : STEPS[step].title}</h3>
        </div>
        <div className={frame === "dialog" ? "vx-scroll" : "vx-scroll thin-scroll"} ref={scrollArea}>
          {phase === "recibida" ? (
            <div className="vx-step">
              <ul className="vx-summary">
                {summary.map(([label, value]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </li>
                ))}
              </ul>
              {meetUrl ? (
                <a className="btn-coral" href={meetUrl} target="_blank" rel="noreferrer">Entrar a Google Meet</a>
              ) : <p>{note || "Siguiente paso: te escribimos al celular que dejaste para acordar la sede y la hora."}</p>}
            </div>
          ) : (
            <div className="vx-step" key={step}>
              {step === 0 ? renderStepOne() : null}
              {step === 1 ? renderStepTwo() : null}
              {step === 2 ? renderStepThree() : null}
              {step === 3 ? renderStepFour() : null}
            </div>
          )}
        </div>
        {phase === "form" ? (
          <div className="vx-nav">
            {step > 0 ? (
              <button type="button" className="btn-line" disabled={pending || meetPending} onClick={() => {
                if (step === 2 && appointmentDetails) {
                  setAppointmentDetails(false);
                  setErrors({});
                } else go(step - 1);
              }}>
                Volver
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button
                type="button"
                className="btn-coral"
                onClick={() => {
                  if (step === 2 && !appointmentDetails) {
                    if (!modality) {
                      setErrors({ modalidad: "Elige cómo quieres la valoración." });
                      return;
                    }
                    setErrors({});
                    setAppointmentDetails(true);
                    return;
                  }
                  if (validate(step)) go(step + 1);
                }}
              >
                Continuar
              </button>
            ) : (
              <button type="button" className="btn-coral" disabled={pending} onClick={finish}>
                {pending ? "Confirmando…" : meetPending ? "Consultar enlace" : modality === "virtual" ? "Confirmar valoración" : "Enviar solicitud"}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );

  function renderFieldError({ id }: { id: string }) {
    if (!errors[id]) return null;
    return (
      <p id={`${id}-error`} className="vx-error" role="alert">
        {errors[id]}
      </p>
    );
  }

  function renderStepOne() {
    const desde = byId("desde-cuando");
    const detalle = byId("zona");
    const guided = needId === "caida-cabello" && picked.includes(needId);
    return (
      <>
        <details className="vx-optional" open={!guided || Boolean(errors.mejorar || errors.otra) || undefined}>
        <summary>{guided ? "Agregar otra necesidad" : "Elegir necesidades"}</summary>
        <fieldset className="vx-field" aria-describedby={errors.mejorar ? "mejorar-error" : undefined}>
          <legend>¿Qué te gustaría mejorar?</legend>
          <div className="vx-cards">
            {cards.map((need) => {
              const on = picked.includes(need.slug);
              return (
                <button
                  key={need.slug}
                  type="button"
                  className={on ? "is-on" : ""}
                  aria-pressed={on}
                  onClick={() => setPicked(on ? picked.filter((id) => id !== need.slug) : [...picked, need.slug])}
                >
                  <NeedMark id={need.slug} />
                  <span>{need.name}</span>
                  {on ? <i aria-hidden="true">✓</i> : null}
                </button>
              );
            })}
            <button
              type="button"
              className={picked.includes("otra") ? "is-on" : ""}
              aria-pressed={picked.includes("otra")}
              onClick={() => setPicked(picked.includes("otra") ? picked.filter((id) => id !== "otra") : [...picked, "otra"])}
            >
              <NeedMark id="otra" />
              <span>Otra necesidad</span>
            </button>
          </div>
          {renderFieldError({ id: "mejorar" })}
        </fieldset>
        {picked.includes("otra") ? (
          <label className="vx-field">
            Cuéntanos esa otra necesidad
            <input value={otra} onChange={(event) => setOtra(event.target.value)} />
            {renderFieldError({ id: "otra" })}
          </label>
        ) : null}
        </details>
        {!guided ? renderOneField({ question: ZONA }) : null}
        {hairDetail && detalle ? renderManyField({ question: detalle }) : null}
        {desde ? renderOneField({ question: desde }) : null}
      </>
    );
  }

  function renderStepTwo() {
    const cuando = byId("cuando");
    return (
      <>
        {renderOneField({ question: ANTES, visual: true })}
        {cuando ? renderOneField({ question: cuando, visual: true }) : null}
      </>
    );
  }

  function renderStepThree() {
    if (!appointmentDetails) {
      return (
        <>
          {promo ? <p className="agenda-summary">{promo}</p> : null}
          <div className="vx-cards vx-modalities" role="group" aria-label="Modalidad">
            {modalities.map(({ id, title, description, icon }) => (
              <button key={id} type="button" className={modality === id ? "is-on" : ""} aria-pressed={modality === id}
                onClick={() => {
                  if (modality !== id) {
                    setSlots([]);
                    setDay(null);
                    setSlot(null);
                  }
                  setModality(id);
                  setErrors({});
                }}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon} /></svg>
                <strong>{title}</strong>
                <span>{description}</span>
              </button>
            ))}
          </div>
          {renderFieldError({ id: "modalidad" })}
        </>
      );
    }
    return (
      <>
        {modality === "virtual" ? (
          meetState === "loading" ? <p role="status">Consultando horarios…</p> :
            meetState === "unavailable" ? <p>La agenda virtual aún no está disponible. Puedes volver y elegir otra modalidad.</p> :
            !days.length ? <p>No hay cupos virtuales disponibles en los próximos días.</p> : (
              <div className="vx-contact">
                <label className="vx-field">
                  Día
                  <select value={day ?? ""} onChange={(event) => { setDay(event.target.value); setSlot(null); }}>
                    {days.map((item) => <option key={item} value={item}>{slots.find((option) => option.day === item)?.dayLabel}</option>)}
                  </select>
                </label>
                <label className="vx-field">
                  Hora de Colombia
                  <select value={slot?.id ?? ""} onChange={(event) => setSlot(slots.find((item) => item.id === event.target.value && item.day === day) ?? null)}>
                    <option value="">Elige una hora</option>
                    {slots.filter((item) => item.day === day).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </label>
              </div>
            )
        ) : null}
        {needsSede ? (
          <fieldset className="vx-field">
            <legend>Sede</legend>
            <div className="vx-chips">
              {["chico", "modelia", "restrepo", "venecia", "colina"]
                .map((slug) => sedes.find((item) => item.slug === slug))
                .filter((item): item is Sede => Boolean(item))
                .map((item) => (
                  <button key={item.slug} type="button" className={sede === item.slug ? "is-on" : ""} aria-pressed={sede === item.slug} onClick={() => setSede(item.slug)}>
                    {item.name}
                  </button>
                ))}
            </div>
            {renderFieldError({ id: "sede" })}
          </fieldset>
        ) : null}
        {modality !== "virtual" && wantsSlot && (!needsSede || sede) ? (
          preview && slots.length ? (
            <div>
              <span className="lp-badge">Horarios de ejemplo</span>
              <div className="vx-chips">
                {days.map((item) => (
                  <button key={item} type="button" className={day === item ? "is-on" : ""} onClick={() => { setDay(item); setSlot(null); }}>
                    {slots.find((slotItem) => slotItem.day === item)?.dayLabel}
                  </button>
                ))}
              </div>
              <div className="vx-chips">
                {slots.filter((item) => item.day === day).map((item) => (
                  <button key={item.id} type="button" className={slot?.id === item.id ? "is-on" : ""} onClick={() => setSlot(item)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p>Te confirmaremos la disponibilidad. No hay horarios publicados.</p>
          )
        ) : null}
        {renderFieldError({ id: "horario" })}
      </>
    );
  }

  function renderStepFour() {
    return (
      <>
        <details className="vx-optional">
          <summary>Revisar mi solicitud</summary>
          <ul className="vx-summary">
            {summary.map(([label, value]) => (
              <li key={label}><span>{label}</span><strong>{value}</strong></li>
            ))}
          </ul>
        </details>
        <div className="vx-contact">
        <label className="vx-field">
          Nombre completo
          <input autoComplete="name" value={patient.nombre} onChange={(event) => setPatient({ ...patient, nombre: event.target.value })} />
          {renderFieldError({ id: "nombre" })}
        </label>
        <label className="vx-field">
          Celular
          <input autoComplete="tel" inputMode="tel" value={patient.celular} onChange={(event) => setPatient({ ...patient, celular: event.target.value })} />
          {renderFieldError({ id: "celular" })}
        </label>
        <label className="vx-field">
          Correo (opcional)
          <input autoComplete="email" inputMode="email" value={patient.email} onChange={(event) => setPatient({ ...patient, email: event.target.value })} />
          {renderFieldError({ id: "email" })}
        </label>
        </div>
        <label className="vx-check">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>
            Autorizo el tratamiento de mis datos para que Luvania me contacte sobre esta valoración, según la{" "}
            <Link href="/politicas/datos-personales">política de datos</Link>.
          </span>
        </label>
        {renderFieldError({ id: "consentimiento" })}
        <label className="absolute -left-[9999px]" aria-hidden="true">
          Sitio web
          <input value={website} tabIndex={-1} autoComplete="off" onChange={(event) => setWebsite(event.target.value)} />
        </label>
        {note ? <p role="status">{note}</p> : null}
      </>
    );
  }

  function renderOneField({ question, visual = false }: { question: LandingQuestion; visual?: boolean }) {
    const current = answerOf(question.id).opciones[0];
    return (
      <fieldset className="vx-field" aria-describedby={errors[question.id] ? `${question.id}-error` : undefined}>
        <legend>{question.prompt}</legend>
        <div className={visual ? "vx-cards vx-visual-options" : "vx-chips"}>
          {question.choices.map((choice) => (
            <button key={choice.id} type="button" className={current === choice.label ? "is-on" : ""} aria-pressed={current === choice.label} onClick={() => chooseOne(question, choice.label)}>
              {visual ? <ExperienceIcon id={choice.id} /> : null}
              <span>{visual ? experienceLabels[choice.id] ?? choice.label : choice.label}</span>
              {visual ? <i aria-hidden="true">{current === choice.label ? "✓" : ""}</i> : null}
            </button>
          ))}
        </div>
        {renderFieldError({ id: question.id })}
      </fieldset>
    );
  }

  function renderManyField({ question }: { question: LandingQuestion }) {
    const current = answerOf(question.id);
    return (
      <fieldset className="vx-field">
        <legend>{question.prompt}</legend>
        <div className="vx-chips">
          {question.choices.map((choice) => {
            const on = current.opciones.includes(choice.label);
            return (
              <button key={choice.id} type="button" className={on ? "is-on" : ""} aria-pressed={on} onClick={() => toggleMany(question, choice.label)}>
                {choice.label}
              </button>
            );
          })}
        </div>
        {renderFieldError({ id: question.id })}
      </fieldset>
    );
  }

  if (frame === "dialog") return shell;
  return (
    <section id="valoracion" className="ficha-block vx-wrap">
      {shell}
    </section>
  );
}

const experienceLabels: Record<string, string> = {
  primera: "Es mi primera vez", cabina: "Tratamiento en cabina", productos: "Productos o suplementos",
  semana: "Lo antes posible", mes: "El próximo mes", tres: "Estoy explorando",
};
const experienceIcons: Record<string, string> = {
  "primera": "M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z",
  "cabina": "M4 19V7l8-4 8 4v12M3 19h18M10 19v-5h4v5",
  "productos": "M9 4h6v4l3 3v8H6v-8l3-3zm-3 9h12",
  "semana": "M13 3L5 14h6l-1 7 9-11h-6z",
  "mes": "M5 6h14v14H5zM8 4v4m8-4v4M5 10h14",
  "tres": "M12 3l8 8-8 10-8-10zM9 14l6-5-2 6z"
};

function ExperienceIcon({ id }: { id: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={experienceIcons[id] ?? experienceIcons.mes} /></svg>;
}

function NeedMark({ id }: { id: string }) {
  const path =
    id === "manchas"
      ? "M8 16c2-6 6-8 8-8s6 2 8 8-2 8-8 8-6-2-8-8Z"
      : id === "flacidez"
        ? "M6 18c4-6 8-6 12 0s8 6 12 0"
        : id === "acne"
          ? "M12 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM7 14a1.4 1.4 0 1 1 0 2.8A1.4 1.4 0 0 1 7 14ZM16 15a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Z"
          : id === "grasa-localizada"
            ? "M8 10h8v8H8Z"
            : "M12 6v12M6 12h12";
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
