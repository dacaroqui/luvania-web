"use client";

import caidaLanding from "@/data/landings/caida-del-cabello";
import type { ExtraNeed, LandingQuestion } from "@/data/landings/types";
import { needPages } from "@/lib/hubs";
import { createMockAgenda, type AgendaSlot, type MeetStatus } from "@/lib/agenda/provider";
import { agendaLink } from "@/lib/whatsapp";
import { submitCrmLead, type CrmAnswer } from "@/lib/crm-lead";
import { blockedPayment } from "@/lib/payment/provider";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Answer = { opciones: string[]; texto: string };
type Modality = "presencial" | "virtual" | "hibrida";
type VirtualMode = "ahora" | "agendar";
type Sede = { slug: string; name: string; whatsapp?: string };

const empty = (): Answer => ({ opciones: [], texto: "" });

const ANTES: LandingQuestion = {
  id: "antes",
  prompt: "¿Has probado algún tratamiento antes?",
  choices: [
    { id: "primera", label: "No, sería mi primera vez" },
    { id: "cabina", label: "Sí, tratamientos en cabina" },
    { id: "productos", label: "Sí, productos o suplementos" },
  ],
};

const RESULTADO: LandingQuestion = {
  id: "resultado",
  prompt: "¿Qué resultado esperas conseguir?",
  choices: [
    { id: "piel", label: "Mejorar el aspecto de mi piel" },
    { id: "comoda", label: "Sentirme más cómoda conmigo" },
    { id: "orientacion", label: "Recibir orientación profesional" },
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
  { title: "Cuéntanos sobre ti", subtitle: "Empecemos por lo que te gustaría mejorar.", kicker: "Tu experiencia Luvania", line: "Tu belleza comienza contigo.", photo: "/stock/hero.webp" },
  { title: "Conozcamos tus preferencias", subtitle: "Así evitamos repetir un camino que no te sirvió.", kicker: "Tus preferencias", line: "A tu ritmo.", photo: "/stock/faciales.webp" },
  { title: "Tu valoración Luvania", subtitle: "La sede y la modalidad se confirman con el equipo.", kicker: "La cita", line: "En sede o en línea.", photo: "/stock/experiencia.webp" },
  { title: "Ya casi terminamos", subtitle: "Revisa el resumen y deja cómo contactarte.", kicker: "El cierre", line: "Un paso más.", photo: "/stock/wellness.webp" },
];

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
}) {
  const agenda = useMemo(() => createMockAgenda(preview), [preview]);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [patient, setPatient] = useState({ nombre: "", celular: "", email: "" });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [picked, setPicked] = useState<string[]>(() => (needPages.some((need) => need.slug === needId) ? [needId] : []));
  const [otra, setOtra] = useState("");
  const [extraAnswers, setExtraAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [modality, setModality] = useState<Modality | null>(null);
  const [virtualMode, setVirtualMode] = useState<VirtualMode | null>(null);
  const [sede, setSede] = useState<string | null>(initialSede);
  const [slots, setSlots] = useState<AgendaSlot[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<AgendaSlot | null>(null);
  const [meet, setMeet] = useState<MeetStatus | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [upsell, setUpsell] = useState<boolean | null>(null);
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
    if (modality === "virtual" && virtualMode === "ahora") {
      setSlots([]);
      return;
    }
    let live = true;
    agenda.getSlots({ modality, sede, days: 5 }).then((next) => {
      if (!live) return;
      setSlots(next);
      setDay((current) => current ?? next[0]?.day ?? null);
    });
    return () => {
      live = false;
    };
  }, [agenda, modality, virtualMode, sede, step]);

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
  const wantsSlot = modality !== null && !(modality === "virtual" && virtualMode === "ahora");
  const hairDetail = picked.includes("caida-cabello") || answerOf("zona-general").opciones.includes("Cabello");
  const tried = answerOf("antes").opciones[0];
  const showTriedDetail = tried && tried !== "No, sería mi primera vez";
  const days = [...new Set(slots.map((item) => item.day))];
  const cards = [
    ...needPages.filter((need) => need.slug === needId || extras.some((item) => item.id === need.slug)),
  ];

  function validate(index: number) {
    const next: Record<string, string> = {};
    if (index === 0) {
      if (picked.length === 0 && !otra.trim()) next.mejorar = "Elige al menos una necesidad.";
      if (picked.includes("otra") && !otra.trim()) next.otra = "Cuéntanos esa otra necesidad.";
      if (!answerOf("zona-general").opciones.length) next["zona-general"] = "Elige una zona.";
      if (hairDetail && byId("zona") && !answerOf("zona").opciones.length) next.zona = "Elige la zona del cuero.";
      if (!answerOf("desde-cuando").opciones.length) next["desde-cuando"] = "Elige hace cuánto lo notas.";
    }
    if (index === 1) {
      if (!answerOf("antes").opciones.length) next.antes = "Elige una opción.";
      if (showTriedDetail && byId("probado") && !answerOf("probado").opciones.length && !answerOf("probado").texto.trim()) {
        next.probado = "Cuéntanos qué probaste.";
      }
      if (!answerOf("resultado").opciones.length) next.resultado = "Elige el cambio que buscas.";
      if (picked.includes("caida-cabello") && byId("satisfecha") && !answerOf("satisfecha").opciones.length) {
        next.satisfecha = "Elige una opción.";
      }
      if (!answerOf("cuando").opciones.length) next.cuando = "Elige un momento.";
      if (byId("decision") && !answerOf("decision").opciones.length) next.decision = "Elige qué te ayudaría a decidir.";
    }
    if (index === 2) {
      if (!modality) next.modalidad = "Elige cómo quieres la valoración.";
      if (modality === "virtual" && !virtualMode) next.virtual = "Elige si es ahora o con hora.";
      if (needsSede && !sede) next.sede = "Elige una sede.";
      if (preview && wantsSlot && slots.length > 0 && !slot) next.horario = "Elige un horario de ejemplo, o espera la confirmación.";
    }
    if (index === 3) {
      for (const id of picked) {
        const need = extras.find((item) => item.id === id);
        if (!need) continue;
        const pendingQuestion = need.questions.find((question) => {
          const value = extraAnswers[id]?.[question.id] ?? empty();
          return value.opciones.length === 0 && !value.texto.trim();
        });
        if (pendingQuestion) next[`extra-${id}`] = "Responde esta necesidad o desmárcala en el primer paso.";
      }
      if (preview && upsell === null) next.upsell = "Dinos si quieres ver la oferta después.";
      if (patient.nombre.trim().length < 2) next.nombre = "Escribe tu nombre.";
      if (patient.celular.replace(/\D/g, "").length < 7) next.celular = "Escribe un celular de al menos 7 dígitos.";
      if (!consent) next.consentimiento = "Hace falta la autorización para contactarte.";
    }
    setErrors(next);
    return Object.values(next).every((value) => !value);
  }

  function go(nextStep: number) {
    setStep(nextStep);
    setErrors({});
  }

  function pack(question: LandingQuestion, value: Answer | undefined): CrmAnswer {
    const current = value ?? empty();
    return { id: question.id, pregunta: question.prompt, opciones: current.opciones, texto: current.texto.trim() };
  }

  async function finish() {
    if (!validate(3) || !modality) return;
    setPending(true);
    setNote("");
    let reserved = reservationId;
    if (preview && slot && wantsSlot) {
      try {
        const channel = modality === "presencial" ? "sede" : "meet";
        const result = await agenda.reserve(slot, channel);
        reserved = result.reservationId;
        setReservationId(result.reservationId);
        setMeet(result.meet);
      } catch {
        reserved = null;
      }
    }
    const shared = [ZONA, ANTES, RESULTADO, ...bank].filter((question, index, list) => list.findIndex((item) => item.id === question.id) === index);
    const confirmed = Boolean(reserved && !reserved.startsWith("ejemplo-"));
    await blockedPayment.createIntent({ concept: "valoracion" });
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
          return [{ id, principal: false, respuestas: need.questions.map((question) => pack(question, extraAnswers[id]?.[question.id])) }];
        }),
      ],
      modalidad: { tipo: modality, virtual: modality === "virtual" ? virtualMode : null },
      slot: slot && reserved ? { id: slot.id, start: slot.start, end: slot.end, reservationId: reserved } : null,
      sede: needsSede ? sede : null,
      upsell: upsell === null ? null : { accepted: upsell, pay: null, receive: null },
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
    ["Preferencias", [answerOf("antes").opciones[0], answerOf("resultado").opciones[0], answerOf("cuando").opciones[0]].filter(Boolean).join(" · ")],
    ["Sede", sedes.find((item) => item.slug === sede)?.name ?? ""],
    ["Modalidad", modality ? `${modality}${virtualMode ? ` · ${virtualMode}` : ""}` : ""],
    ["Origen", origin ? `${origin.name} (${origin.id})` : ""],
    ["Horario", slot ? `${slot.dayLabel} ${slot.label}${preview ? " · ejemplo, sin confirmar" : ""}` : preview ? "" : "Te confirmaremos la disponibilidad"],
  ].filter(([, value]) => value);

  const shell = (
    <div className={`vx ${frame === "dialog" ? "is-dialog" : ""}`}>
      <aside className="vx-side">
        {/* provisional: stock */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STEPS[step].photo} alt="" />
        <div>
          <p>{STEPS[step].kicker}</p>
          <h2 className="display">{STEPS[step].line}</h2>
          <span className="lp-badge">Foto provisional</span>
        </div>
      </aside>
      <div className="vx-main">
        <header className="vx-top">
          <p>Valoración personalizada</p>
          <p>
            0{step + 1} / 04
          </p>
        </header>
        <div className="vx-progress" aria-hidden="true">
          {STEPS.map((item, index) => (
            <span key={item.title} className={index <= step ? "is-done" : ""} />
          ))}
        </div>
        <div className="vx-scroll thin-scroll">
          {phase === "recibida" ? (
            <div className="vx-step">
              <h3 className="display">Solicitud recibida</h3>
              <p>El equipo te contacta para confirmar la disponibilidad. Esta pantalla no es una cita confirmada.</p>
              <ul className="vx-summary">
                {summary.map(([label, value]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </li>
                ))}
              </ul>
              <p>{note || "Siguiente paso: te escribimos al celular que dejaste para acordar la sede y la hora."}</p>
            </div>
          ) : (
            <div className="vx-step" key={step}>
              <h3 className="display">{STEPS[step].title}</h3>
              <p className="vx-sub">{STEPS[step].subtitle}</p>
              {step === 0 ? <StepOne /> : null}
              {step === 1 ? <StepTwo /> : null}
              {step === 2 ? <StepThree /> : null}
              {step === 3 ? <StepFour /> : null}
            </div>
          )}
        </div>
        {phase === "form" ? (
          <div className="vx-nav">
            {step > 0 ? (
              <button type="button" className="btn-line" onClick={() => go(step - 1)}>
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
                  if (validate(step)) go(step + 1);
                }}
              >
                Continuar
              </button>
            ) : (
              <button type="button" className="btn-coral" disabled={pending} onClick={finish}>
                {pending ? "Enviando…" : "Enviar solicitud"}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );

  function FieldError({ id }: { id: string }) {
    if (!errors[id]) return null;
    return (
      <p id={`${id}-error`} className="vx-error" role="alert">
        {errors[id]}
      </p>
    );
  }

  function StepOne() {
    const desde = byId("desde-cuando");
    const detalle = byId("zona");
    return (
      <>
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
          <FieldError id="mejorar" />
        </fieldset>
        {picked.includes("otra") ? (
          <label className="vx-field">
            Cuéntanos esa otra necesidad
            <input value={otra} onChange={(event) => setOtra(event.target.value)} />
            <FieldError id="otra" />
          </label>
        ) : null}
        <OneField question={ZONA} />
        {hairDetail && detalle ? <ManyField question={detalle} /> : null}
        {desde ? <OneField question={desde} /> : null}
      </>
    );
  }

  function StepTwo() {
    const probado = byId("probado");
    const satisfecha = byId("satisfecha");
    const cuando = byId("cuando");
    const decision = byId("decision");
    return (
      <>
        <OneField question={ANTES} />
        {showTriedDetail && probado ? <ManyField question={probado} /> : null}
        <OneField question={RESULTADO} />
        {picked.includes("caida-cabello") && satisfecha ? <ManyField question={satisfecha} /> : null}
        {cuando ? <OneField question={cuando} /> : null}
        {decision ? <ManyField question={decision} /> : null}
      </>
    );
  }

  function StepThree() {
    return (
      <>
        {promo ? <p className="agenda-summary">{promo}</p> : null}
        <div className="vx-cards" role="group" aria-label="Modalidad">
          {(
            [
              ["presencial", "Presencial", "Siempre queda agendada. Eliges una sede."],
              ["virtual", "Virtual", "Videollamada ahora, en horario de asesora, o con hora."],
              ["hibrida", "Híbrida", "Una parte en sede y otra por videollamada."],
            ] as const
          ).map(([id, name, text]) => (
            <button key={id} type="button" className={modality === id ? "is-on" : ""} aria-pressed={modality === id} onClick={() => setModality(id)}>
              <strong>{name}</strong>
              <span>{text}</span>
              {preview ? <em className="lp-badge">Beneficio por definir</em> : null}
            </button>
          ))}
        </div>
        <FieldError id="modalidad" />
        {modality === "virtual" ? (
          <div className="vx-chips" role="group" aria-label="Cuándo">
            <button type="button" className={virtualMode === "ahora" ? "is-on" : ""} disabled={!preview} aria-pressed={virtualMode === "ahora"} onClick={() => setVirtualMode("ahora")}>
              Atenderme ahora
            </button>
            <button type="button" className={virtualMode === "agendar" ? "is-on" : ""} aria-pressed={virtualMode === "agendar"} onClick={() => setVirtualMode("agendar")}>
              Agendar hora
            </button>
          </div>
        ) : null}
        {preview && modality === "virtual" ? <span className="lp-badge">Horario de asesora por definir</span> : null}
        {preview && modality === "virtual" && virtualMode === "ahora" ? <p>Fila de ejemplo. No hay una asesora conectada.</p> : null}
        <FieldError id="virtual" />
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
            <FieldError id="sede" />
          </fieldset>
        ) : null}
        {modality && wantsSlot ? (
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
        <FieldError id="horario" />
        {modality && modality !== "presencial" ? (
          <aside className="lp-meet">
            <p>Google Meet</p>
            {preview ? <span className="lp-badge">Enlace por definir</span> : null}
            <p>La videollamada usará Google Meet. El enlace no se crea hasta conectar la cuenta.</p>
            <button type="button" disabled>
              {nextMeetLabel(nextMeetSafe(meet))}
            </button>
          </aside>
        ) : null}
      </>
    );
  }

  function StepFour() {
    return (
      <>
        <ul className="vx-summary">
          {summary.map(([label, value]) => (
            <li key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <button type="button" onClick={() => go(label === "Sede" || label === "Modalidad" || label === "Horario" ? 2 : label === "Preferencias" ? 1 : 0)}>
                Editar
              </button>
            </li>
          ))}
        </ul>
        {picked.map((id) => {
          const need = extras.find((item) => item.id === id);
          if (!need || need.questions.length === 0) return null;
          return (
            <fieldset key={id} className="vx-field">
              <legend>¿Tienes alguna otra necesidad? {need.name}</legend>
              {need.questions.map((question) => {
                const value = extraAnswers[id]?.[question.id] ?? empty();
                return (
                  <div key={question.id}>
                    <p>{question.prompt}</p>
                    <div className="vx-chips">
                      {question.choices.map((choice) => {
                        const on = value.opciones.includes(choice.label);
                        return (
                          <button
                            key={choice.id}
                            type="button"
                            className={on ? "is-on" : ""}
                            aria-pressed={on}
                            onClick={() => {
                              const opciones = on ? value.opciones.filter((item) => item !== choice.label) : [...value.opciones, choice.label];
                              setExtraAnswers({ ...extraAnswers, [id]: { ...extraAnswers[id], [question.id]: { ...value, opciones } } });
                            }}
                          >
                            {choice.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <FieldError id={`extra-${id}`} />
            </fieldset>
          );
        })}
        {preview ? (
          <article className="lp-upsell">
            <span className="lp-badge">Montos por definir</span>
            <h4 className="display">Paga un monto por definir y recibe un paquete por definir</h4>
            <div className="vx-chips">
              <button type="button" className={upsell ? "is-on" : ""} aria-pressed={upsell === true} onClick={() => setUpsell(true)}>
                Quiero verla después
              </button>
              <button type="button" className={upsell === false ? "is-on" : ""} aria-pressed={upsell === false} onClick={() => setUpsell(false)}>
                No, gracias
              </button>
            </div>
            <FieldError id="upsell" />
          </article>
        ) : (
          <p>Esta oferta aún no está publicada.</p>
        )}
        <p>El pago en línea todavía no tiene pasarela.</p>
        <button type="button" className="btn-coral" disabled>
          Pago en línea próximamente
        </button>
        <label className="vx-field">
          Nombre completo
          <input autoComplete="name" value={patient.nombre} onChange={(event) => setPatient({ ...patient, nombre: event.target.value })} />
          <FieldError id="nombre" />
        </label>
        <label className="vx-field">
          Celular
          <input autoComplete="tel" inputMode="tel" value={patient.celular} onChange={(event) => setPatient({ ...patient, celular: event.target.value })} />
          <FieldError id="celular" />
        </label>
        <label className="vx-field">
          Correo, si quieres
          <input autoComplete="email" inputMode="email" value={patient.email} onChange={(event) => setPatient({ ...patient, email: event.target.value })} />
        </label>
        <label className="vx-check">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>
            Autorizo el tratamiento de mis datos para que Luvania me contacte sobre esta valoración, según la{" "}
            <Link href="/politicas/datos-personales">política de datos</Link>.
          </span>
        </label>
        <FieldError id="consentimiento" />
        <label className="absolute -left-[9999px]" aria-hidden="true">
          Sitio web
          <input value={website} tabIndex={-1} autoComplete="off" onChange={(event) => setWebsite(event.target.value)} />
        </label>
        {note ? <p role="status">{note}</p> : null}
      </>
    );
  }

  function OneField({ question }: { question: LandingQuestion }) {
    const current = answerOf(question.id).opciones[0];
    return (
      <fieldset className="vx-field" aria-describedby={errors[question.id] ? `${question.id}-error` : undefined}>
        <legend>{question.prompt}</legend>
        <div className="vx-chips">
          {question.choices.map((choice) => (
            <button key={choice.id} type="button" className={current === choice.label ? "is-on" : ""} aria-pressed={current === choice.label} onClick={() => chooseOne(question, choice.label)}>
              {choice.label}
            </button>
          ))}
        </div>
        <FieldError id={question.id} />
      </fieldset>
    );
  }

  function ManyField({ question }: { question: LandingQuestion }) {
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
        <label>
          Si quieres agregar algo
          <textarea rows={2} value={current.texto} onChange={(event) => setAnswers({ ...answers, [question.id]: { ...current, texto: event.target.value } })} />
        </label>
        <FieldError id={question.id} />
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

function nextMeetSafe(meet: MeetStatus | null) {
  return meet;
}

function nextMeetLabel(meet: MeetStatus | null) {
  return meet ? "Meet pendiente de conectar" : "Abrir Meet";
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
