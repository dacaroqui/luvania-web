"use client";

import type { ExtraNeed, LandingQuestion } from "@/data/landings/types";
import { createMockAgenda, type AgendaSlot, type MeetStatus } from "@/lib/agenda/provider";
import { submitCrmLead, type CrmAnswer } from "@/lib/crm-lead";
import { blockedPayment } from "@/lib/payment/provider";
import { useEffect, useMemo, useState } from "react";

type Answer = { opciones: string[]; texto: string };
type Modality = "presencial" | "virtual" | "hibrida";
type VirtualMode = "ahora" | "agendar";

const empty = (): Answer => ({ opciones: [], texto: "" });

export function ValuationWizard({
  preview,
  needId,
  path,
  questions,
  extras,
  sedes,
}: {
  preview: boolean;
  needId: string;
  path: string;
  questions: LandingQuestion[];
  extras: ExtraNeed[];
  sedes: { slug: string; name: string }[];
}) {
  const agenda = useMemo(() => createMockAgenda(preview), [preview]);
  const [step, setStep] = useState(0);
  const [patient, setPatient] = useState({ nombre: "", celular: "", email: "" });
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [picked, setPicked] = useState<string[]>([]);
  const [extraAnswers, setExtraAnswers] = useState<Record<string, Record<string, Answer>>>({});
  const [modality, setModality] = useState<Modality | null>(null);
  const [virtualMode, setVirtualMode] = useState<VirtualMode | null>(null);
  const [sede, setSede] = useState<string | null>(null);
  const [slots, setSlots] = useState<AgendaSlot[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<AgendaSlot | null>(null);
  const [meet, setMeet] = useState<MeetStatus | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [upsell, setUpsell] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [utm, setUtm] = useState({ source: null as string | null, campaign: null as string | null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({ source: params.get("utm_source"), campaign: params.get("utm_campaign") });
  }, []);

  const needsSede = modality === "presencial" || modality === "hibrida";
  const wantsSlot = modality !== null && !(modality === "virtual" && virtualMode === "ahora");
  const days = [...new Set(slots.map((item) => item.day))];

  function answerOf(id: string) {
    return answers[id] ?? empty();
  }

  function toggle(id: string, label: string) {
    const current = answerOf(id);
    const opciones = current.opciones.includes(label)
      ? current.opciones.filter((item) => item !== label)
      : [...current.opciones, label];
    setAnswers({ ...answers, [id]: { ...current, opciones } });
  }

  function answered(question: LandingQuestion, value: Answer | undefined) {
    const current = value ?? empty();
    return current.opciones.length > 0 || current.texto.trim().length > 0;
  }

  const stepOneReady =
    patient.nombre.trim().length > 1 &&
    patient.celular.replace(/\D/g, "").length >= 7 &&
    questions.every((question) => answered(question, answers[question.id]));

  const stepTwoReady = picked.every((id) => {
    const need = extras.find((item) => item.id === id);
    if (!need) return false;
    return need.questions.every((question) => answered(question, extraAnswers[id]?.[question.id]));
  });

  const stepThreeReady =
    modality !== null &&
    (modality !== "virtual" || virtualMode !== null) &&
    (!needsSede || sede !== null) &&
    (modality !== "virtual" || virtualMode !== "ahora" || preview);

  async function loadSlots(nextModality: Modality, nextSede: string | null) {
    const next = await agenda.getSlots({ modality: nextModality, sede: nextSede, days: 5 });
    setSlots(next);
    setDay(next[0]?.day ?? null);
    setSlot(null);
  }

  async function continueFromModality() {
    if (!modality) return;
    if (modality === "virtual" && virtualMode === "ahora") {
      setSlot(null);
      setReservationId(null);
      setMeet({ provider: "google-meet", url: null, status: "pendiente" });
      setStep(3);
      return;
    }
    await loadSlots(modality, sede);
    setStep(3);
  }

  async function continueFromAgenda() {
    if (!slot || !modality) return;
    const channel = modality === "presencial" ? "sede" : "meet";
    const reserved = await agenda.reserve(slot, channel);
    setReservationId(reserved.reservationId);
    setMeet(reserved.meet);
    setStep(4);
  }

  function pack(question: LandingQuestion, value: Answer | undefined): CrmAnswer {
    const current = value ?? empty();
    return { id: question.id, pregunta: question.prompt, opciones: current.opciones, texto: current.texto.trim() };
  }

  async function save() {
    await blockedPayment.createIntent({ concept: "valoracion" });
    const result = submitCrmLead({
      paciente: {
        nombre: patient.nombre.trim(),
        celular: patient.celular.trim(),
        email: patient.email.trim() || null,
      },
      fuente: { utm_source: utm.source, utm_campaign: utm.campaign, path },
      necesidad: needId,
      necesidades: [
        { id: needId, principal: true, respuestas: questions.map((question) => pack(question, answers[question.id])) },
        ...picked.flatMap((id) => {
          const need = extras.find((item) => item.id === id);
          if (!need) return [];
          return [{ id, principal: false, respuestas: need.questions.map((question) => pack(question, extraAnswers[id]?.[question.id])) }];
        }),
      ],
      modalidad: { tipo: modality ?? "presencial", virtual: modality === "virtual" ? virtualMode : null },
      slot:
        slot && reservationId
          ? { id: slot.id, start: slot.start, end: slot.end, reservationId }
          : null,
      sede: needsSede ? sede : null,
      upsell: upsell === null ? null : { accepted: upsell, pay: null, receive: null },
      pago: { status: "no-disponible", amount: null, currency: "COP" },
    });
    if (result.ok) setSaved(true);
  }

  const titles = ["Tu necesidad", "Otras necesidades", "Modalidad", "Fecha y hora", "Después de agendar", "Pago"];

  return (
    <section id="valoracion" className="lp-wizard glass" aria-labelledby="wizard-title">
      <ol className="lp-progress">
        {titles.map((title, index) => (
          <li key={title} aria-current={index === step ? "step" : undefined}>
            {title}
          </li>
        ))}
      </ol>
      <h2 id="wizard-title" className="display">
        {titles[step]}
      </h2>

      {step === 0 ? (
        <div className="lp-step">
          <div className="lp-patient">
            <label>
              Nombre
              <input value={patient.nombre} autoComplete="name" onChange={(event) => setPatient({ ...patient, nombre: event.target.value })} />
            </label>
            <label>
              Celular
              <input value={patient.celular} autoComplete="tel" inputMode="tel" onChange={(event) => setPatient({ ...patient, celular: event.target.value })} />
            </label>
            <label>
              Correo, si quieres
              <input value={patient.email} autoComplete="email" inputMode="email" onChange={(event) => setPatient({ ...patient, email: event.target.value })} />
            </label>
          </div>
          {questions.map((question) => (
            <Question
              key={question.id}
              question={question}
              value={answerOf(question.id)}
              onToggle={(label) => toggle(question.id, label)}
              onText={(texto) => setAnswers({ ...answers, [question.id]: { ...answerOf(question.id), texto } })}
            />
          ))}
          <button type="button" className="btn-coral" disabled={!stepOneReady} onClick={() => setStep(1)}>
            Continuar
          </button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="lp-step">
          <p>¿Tienes alguna otra necesidad? Puedes marcar varias. Si no, sigue sin agregarlas.</p>
          <ul className="lp-need-grid">
            {extras.map((need) => {
              const on = picked.includes(need.id);
              return (
                <li key={need.id}>
                  <button
                    type="button"
                    className={on ? "is-on" : ""}
                    aria-pressed={on}
                    onClick={() => setPicked(on ? picked.filter((id) => id !== need.id) : [...picked, need.id])}
                  >
                    <strong>{need.name}</strong>
                    <span>{need.text}</span>
                    <span>{need.treatments.join(" · ")}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {picked.map((id) => {
            const need = extras.find((item) => item.id === id);
            if (!need) return null;
            return (
              <fieldset key={id} className="lp-extra">
                <legend className="display">{need.name}</legend>
                {need.questions.map((question) => {
                  const value = extraAnswers[id]?.[question.id] ?? empty();
                  return (
                    <Question
                      key={question.id}
                      question={question}
                      value={value}
                      onToggle={(label) => {
                        const opciones = value.opciones.includes(label)
                          ? value.opciones.filter((item) => item !== label)
                          : [...value.opciones, label];
                        setExtraAnswers({ ...extraAnswers, [id]: { ...extraAnswers[id], [question.id]: { ...value, opciones } } });
                      }}
                      onText={(texto) =>
                        setExtraAnswers({ ...extraAnswers, [id]: { ...extraAnswers[id], [question.id]: { ...value, texto } } })
                      }
                    />
                  );
                })}
              </fieldset>
            );
          })}
          <div className="lp-actions">
            <button type="button" className="btn-line" onClick={() => setStep(0)}>
              Atrás
            </button>
            <button
              type="button"
              className="btn-line"
              onClick={() => {
                setPicked([]);
                setStep(2);
              }}
            >
              No, continuar
            </button>
            <button type="button" className="btn-coral" disabled={picked.length === 0 || !stepTwoReady} onClick={() => setStep(2)}>
              Continuar
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="lp-step">
          <div className="lp-modes" role="group" aria-label="Modalidad">
            {(
              [
                ["presencial", "Presencial", "Siempre queda agendada. Eliges una sede."],
                ["virtual", "Virtual", "Videollamada. Puedes pedirla ahora o dejar una hora."],
                ["hibrida", "Híbrida", "Una parte en sede y otra por videollamada."],
              ] as const
            ).map(([id, name, text]) => (
              <button key={id} type="button" className={modality === id ? "is-on" : ""} aria-pressed={modality === id} onClick={() => setModality(id)}>
                <strong>{name}</strong>
                <span>{text}</span>
                {preview ? <span className="lp-badge">Beneficio por definir</span> : null}
              </button>
            ))}
          </div>
          {modality === "virtual" ? (
            <div className="lp-modes" role="group" aria-label="Cuándo">
              <button
                type="button"
                className={virtualMode === "ahora" ? "is-on" : ""}
                aria-pressed={virtualMode === "ahora"}
                disabled={!preview}
                onClick={() => setVirtualMode("ahora")}
              >
                <strong>Atenderme ahora</strong>
                <span>Videollamada inmediata, con fila de espera, solo en horario de asesora.</span>
                {preview ? <span className="lp-badge">Horario de asesora por definir</span> : <span>Aún no hay horario publicado.</span>}
              </button>
              <button type="button" className={virtualMode === "agendar" ? "is-on" : ""} aria-pressed={virtualMode === "agendar"} onClick={() => setVirtualMode("agendar")}>
                <strong>Agendar hora</strong>
                <span>Dejas un cupo y el enlace de Meet queda pendiente de conectar.</span>
              </button>
            </div>
          ) : null}
          {preview && modality === "virtual" && virtualMode === "ahora" ? (
            <p className="lp-queue">
              <span className="lp-badge">Fila de ejemplo</span>
              Lugar ilustrativo. No hay una asesora conectada.
            </p>
          ) : null}
          {needsSede ? (
            <fieldset className="lp-sedes">
              <legend>Elige una sede</legend>
              {sedes.map((item) => (
                <label key={item.slug} className={sede === item.slug ? "is-on" : ""}>
                  <input type="radio" name="sede" checked={sede === item.slug} onChange={() => setSede(item.slug)} />
                  {item.name}
                </label>
              ))}
            </fieldset>
          ) : null}
          <div className="lp-actions">
            <button type="button" className="btn-line" onClick={() => setStep(1)}>
              Atrás
            </button>
            <button type="button" className="btn-coral" disabled={!stepThreeReady} onClick={continueFromModality}>
              Continuar
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="lp-step">
          {modality === "virtual" && virtualMode === "ahora" ? (
            <p>No hace falta elegir hora. La fila de esta vista es de ejemplo.</p>
          ) : preview && slots.length ? (
            <>
              <p>
                <span className="lp-badge">Horarios de ejemplo</span>
                Todavía no salen de Google Calendar.
              </p>
              <div className="lp-days" role="group" aria-label="Día">
                {days.map((item) => (
                  <button key={item} type="button" className={day === item ? "is-on" : ""} aria-pressed={day === item} onClick={() => setDay(item)}>
                    {slots.find((slotItem) => slotItem.day === item)?.dayLabel}
                  </button>
                ))}
              </div>
              <div className="lp-times" role="radiogroup" aria-label="Hora">
                {slots
                  .filter((item) => item.day === day)
                  .map((item) => (
                    <button key={item.id} type="button" role="radio" aria-checked={slot?.id === item.id} className={slot?.id === item.id ? "is-on" : ""} onClick={() => setSlot(item)}>
                      {item.label}
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <p className="lp-blocked">Los horarios se publicarán al conectar el calendario. Aún no hay cupos.</p>
          )}
          {modality !== "presencial" ? <MeetPanel preview={preview} meet={meet} /> : null}
          <div className="lp-actions">
            <button type="button" className="btn-line" onClick={() => setStep(2)}>
              Atrás
            </button>
            <button
              type="button"
              className="btn-coral"
              disabled={wantsSlot && !slot}
              onClick={wantsSlot ? continueFromAgenda : () => setStep(4)}
            >
              Continuar
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="lp-step">
          {preview ? (
            <article className="lp-upsell">
              <span className="lp-badge">Montos por definir</span>
              <h3 className="display">Paga un monto por definir y recibe un paquete por definir en tratamientos</h3>
              <p>La oferta se escribe cuando existan los valores. Aquí no hay un precio.</p>
              <div className="lp-actions">
                <button type="button" className={upsell ? "btn-coral" : "btn-line"} aria-pressed={upsell === true} onClick={() => setUpsell(true)}>
                  Quiero verla después
                </button>
                <button type="button" className={upsell === false ? "btn-coral" : "btn-line"} aria-pressed={upsell === false} onClick={() => setUpsell(false)}>
                  No, gracias
                </button>
              </div>
            </article>
          ) : (
            <p className="lp-blocked">Esta oferta aún no está publicada.</p>
          )}
          <div className="lp-actions">
            <button type="button" className="btn-line" onClick={() => setStep(3)}>
              Atrás
            </button>
            <button type="button" className="btn-coral" disabled={preview && upsell === null} onClick={() => setStep(5)}>
              Continuar
            </button>
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="lp-step">
          <p>El pago en línea todavía no tiene pasarela.</p>
          <button type="button" className="btn-coral" disabled>
            Pago en línea próximamente
          </button>
          {preview ? (
            <button type="button" className="btn-line" onClick={save}>
              Registrar solicitud en este navegador
            </button>
          ) : (
            <p className="lp-blocked">El envío al CRM aún no está conectado. No guardamos estos datos.</p>
          )}
          {saved ? <p className="lp-saved">Quedó en la consola de este navegador. No se envió a ningún servicio.</p> : null}
          <button type="button" className="btn-line" onClick={() => setStep(4)}>
            Atrás
          </button>
        </div>
      ) : null}
    </section>
  );
}

function Question({
  question,
  value,
  onToggle,
  onText,
}: {
  question: LandingQuestion;
  value: Answer;
  onToggle: (label: string) => void;
  onText: (value: string) => void;
}) {
  return (
    <fieldset className="lp-question">
      <legend>{question.prompt}</legend>
      <div className="lp-chips">
        {question.choices.map((choice) => {
          const on = value.opciones.includes(choice.label);
          return (
            <button key={choice.id} type="button" className={on ? "is-on" : ""} aria-pressed={on} onClick={() => onToggle(choice.label)}>
              {choice.label}
            </button>
          );
        })}
      </div>
      <label>
        Si quieres agregar algo
        <textarea value={value.texto} rows={2} onChange={(event) => onText(event.target.value)} />
      </label>
    </fieldset>
  );
}

function MeetPanel({ preview, meet }: { preview: boolean; meet: MeetStatus | null }) {
  return (
    <aside className="lp-meet">
      <p className="lp-kicker">Google Meet</p>
      {preview ? <span className="lp-badge">Enlace por definir</span> : null}
      <p>La videollamada usará Google Meet. El enlace no se crea hasta conectar la cuenta.</p>
      <button type="button" disabled>
        {meet ? "Meet pendiente de conectar" : "Abrir Meet"}
      </button>
    </aside>
  );
}
