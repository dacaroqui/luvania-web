"use client";

import { copyHairMask, createHairSegmenter, createHairTracker, locateHairline, type HairMask, type HairPose, type HairSegmenter, type HairTracker } from "@/lib/simulation/hair-tracker";
import { paintDensity, prepareDensityMask, readPhoto, type DensityMask, type DensityStyle } from "@/lib/simulation/provider";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";

import { CompareSlider } from "./compare-slider";

const initialPoint = { x: 0.5, y: 0.16 };
const previewSize = 540;
const frameInterval = 1000 / 30;
const privacyNote = "Tu imagen se queda en el dispositivo. No se guarda ni se envía.";
const filterNote = "Filtro ilustrativo. No predice resultados de un tratamiento.";
type Tracking = "loading" | "searching" | "ready" | "unavailable" | "manual";
type Status = "idle" | "opening" | "live" | "loading-photo" | "photo" | "error";

type Example = { before: ReactNode; after: ReactNode; label: string };

export function SimulationPanel({ example, onActiveChange }: {
  example?: Example;
  onActiveChange?: (active: boolean) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  const beforeCanvas = useRef<HTMLCanvasElement>(null);
  const afterCanvas = useRef<HTMLCanvasElement>(null);
  const [adjusting, setAdjusting] = useState(false);
  const aimSurface = useRef<HTMLButtonElement>(null);
  const aimToggle = useRef<HTMLButtonElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const frame = useRef(0);
  const session = useRef(0);
  const sourcePhoto = useRef<HTMLCanvasElement | null>(null);
  const point = useRef(initialPoint);
  const tracker = useRef<HairTracker | null>(null);
  const pose = useRef<HairPose | null>(null);
  const segmenter = useRef<HairSegmenter | null>(null);
  const segmentation = useRef<{ source: HairMask; density: DensityMask; pose: HairPose | null } | null>(null);
  const selectedStyle = useRef<DensityStyle>("masculino");
  const [style, setStyle] = useState<DensityStyle>("masculino");
  const [maskStatus, setMaskStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");

  function updateMask(source: HairMask | null) {
    if (!source || !source.pixels.includes(1)) {
      segmentation.current = null;
      setMaskStatus("empty");
      return;
    }
    segmentation.current = {
      source,
      density: prepareDensityMask(source, selectedStyle.current),
      pose: pose.current,
    };
    setMaskStatus("ready");
  }
  const manual = useRef(false);
  const [tracking, setTracking] = useState<Tracking>("loading");

  function updatePose(next: HairPose) {
    const current = pose.current;
    if (!current || manual.current) {
      pose.current = next;
    } else {
      const blend = (a: number, b: number) => a + (b - a) * 0.46;
      pose.current = {
        x: blend(current.x, next.x), y: blend(current.y, next.y),
        width: blend(current.width, next.width), height: blend(current.height, next.height),
        angle: blend(current.angle, next.angle),
      };
    }
    point.current = next;
  }

  const releaseCamera = useCallback(() => {
    session.current += 1;
    window.cancelAnimationFrame(frame.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    tracker.current?.close();
    tracker.current = null;
    segmenter.current?.close();
    segmenter.current = null;
    segmentation.current = null;
    pose.current = null;
    manual.current = false;
    if (video.current) video.current.srcObject = null;
  }, []);

  const clearPreview = useCallback(() => {
    if (beforeCanvas.current) beforeCanvas.current.width = 1;
    if (afterCanvas.current) afterCanvas.current.width = 1;
    setAdjusting(false);
  }, []);

  useEffect(() => {
    function closeOnPageHide() {
      releaseCamera();
      sourcePhoto.current = null;
      clearPreview();
      setStatus("idle");
    }
    window.addEventListener("pagehide", closeOnPageHide);
    return () => {
      window.removeEventListener("pagehide", closeOnPageHide);
      releaseCamera();
    };
  }, [clearPreview, releaseCamera]);

  function fail(message: string) {
    releaseCamera();
    sourcePhoto.current = null;
    clearPreview();
    setError(message);
    setStatus("error");
  }

  function draw(source: CanvasImageSource, width: number, height: number, mirror: boolean) {
    const before = beforeCanvas.current;
    const after = afterCanvas.current;
    if (!before || !after || !width || !height) return;
    const scale = Math.min(1, previewSize / Math.max(width, height));
    const outputWidth = Math.max(1, Math.round(width * scale));
    const outputHeight = Math.max(1, Math.round(height * scale));
    for (const target of [before, after]) {
      if (target.width !== outputWidth) target.width = outputWidth;
      if (target.height !== outputHeight) target.height = outputHeight;
    }

    const original = before.getContext("2d");
    const filtered = after.getContext("2d", { willReadFrequently: true });
    if (!original || !filtered) throw new Error("Canvas no disponible");

    if (!mirror) {
      original.clearRect(0, 0, outputWidth, outputHeight);
      filtered.clearRect(0, 0, outputWidth, outputHeight);
    }
    original.setTransform(mirror ? -1 : 1, 0, 0, 1, mirror ? outputWidth : 0, 0);
    original.drawImage(source, 0, 0, outputWidth, outputHeight);
    original.resetTransform();
    filtered.drawImage(before, 0, 0);
    const current = pose.current;
    const mask = segmentation.current;
    if (current && mask) {
      paintDensity(filtered, current, mask.density, manual.current ? current : mask.pose ?? current, selectedStyle.current);
    }
  }

  async function openCamera() {
    setError("");
    sourcePhoto.current = null;
    point.current = initialPoint;
    setTracking("loading");
    setMaskStatus("loading");

    if (!navigator.mediaDevices?.getUserMedia) {
      fail("La cámara no está disponible. Prueba con una foto.");
      return;
    }

    const id = ++session.current;
    setStatus("opening");
    try {
      const next = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "user" }, width: { ideal: 640 }, height: { ideal: 480 } },
      });
      const element = video.current;
      if (session.current !== id || !element) {
        next.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = next;
      next.getVideoTracks()[0]?.addEventListener("ended", () => {
        if (session.current === id) fail("La cámara se desconectó. Puedes volver a abrirla o usar una foto.");
      }, { once: true });
      element.srcObject = next;
      await element.play();
      if (session.current !== id) return;

      void createHairTracker("VIDEO").then((model) => {
        if (session.current !== id) {
          model.close();
          return;
        }
        tracker.current = model;
        if (!manual.current) setTracking("searching");
      }).catch(() => {
        if (session.current === id && !manual.current) setTracking("unavailable");
      });

      void createHairSegmenter("VIDEO").then((which) => {
        if (session.current !== id) {
          which.close();
          return;
        }
        segmenter.current = which;
      }).catch(() => {
        if (session.current === id) setMaskStatus("error");
      });

      let previous = -Infinity;
      let nextMask = 0;
      let lastDetection = -Infinity;
      let lastFace = -Infinity;
      let lastVideoTime = -1;
      let shown = false;
      const render = (now: number) => {
        if (session.current !== id) return;
        if (element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && element.videoWidth && now - previous >= frameInterval) {
          if (tracker.current && !manual.current && now - lastDetection >= 95 && lastVideoTime !== element.currentTime) {
            lastDetection = now;
            lastVideoTime = element.currentTime;
            try {
              const detected = tracker.current.detectForVideo(element, now);
              const next = locateHairline(detected, element.videoWidth, element.videoHeight, true);
              if (next) {
                updatePose(next);
                lastFace = now;
                setTracking("ready");
              } else if (now - lastFace > 300) {
                pose.current = null;
                setTracking("searching");
              }
            } catch {
              tracker.current?.close();
              tracker.current = null;
              pose.current = null;
              setTracking("unavailable");
            }
          }
          if (segmenter.current && now >= nextMask) {
            const started = performance.now();
            try {
              segmenter.current.segmentForVideo(element, now, (result) => updateMask(copyHairMask(result, true)));
              const elapsed = performance.now() - started;
              nextMask = now + Math.max(320, elapsed * 4);
            } catch {
              segmenter.current?.close();
              segmenter.current = null;
              segmentation.current = null;
              setMaskStatus("error");
            }
          }
          try {
            draw(element, element.videoWidth, element.videoHeight, true);
          } catch {
            fail("No pudimos mostrar el filtro en vivo. Prueba con una foto.");
            return;
          }
          previous = now;
          if (!shown) {
            shown = true;
            setStatus("live");
          }
        }
        frame.current = window.requestAnimationFrame(render);
      };
      frame.current = window.requestAnimationFrame(render);
    } catch {
      if (session.current === id) fail("No pudimos acceder a la cámara. Revisa el permiso o usa una foto.");
    }
  }

  async function openPhoto(file: File | undefined) {
    if (!file) return;
    releaseCamera();
    const id = session.current;
    setError("");
    setStatus("loading-photo");
    setMaskStatus("loading");
    try {
      const image = await readPhoto(file);
      if (session.current !== id) return;
      point.current = initialPoint;
      sourcePhoto.current = image;
      draw(image, image.width, image.height, false);
      setStatus("photo");
      setTracking("loading");
      void createHairSegmenter("IMAGE").then((which) => {
        try {
          if (session.current !== id) return;
          which.segment(image, (result) => updateMask(copyHairMask(result, false)));
          draw(image, image.width, image.height, false);
        } finally {
          which.close();
        }
      }).catch(() => {
        if (session.current === id) setMaskStatus("error");
      });
      void createHairTracker("IMAGE").then((model) => {
        try {
          if (session.current !== id || manual.current) return;
          const next = locateHairline(model.detect(image), image.width, image.height, false);
          if (next) {
            updatePose(next);
            draw(image, image.width, image.height, false);
          }
          setTracking(next ? "ready" : "unavailable");
        } finally {
          model.close();
        }
      }).catch(() => {
        if (session.current === id && !manual.current) setTracking("unavailable");
      });
    } catch {
      if (session.current === id) fail("No pudimos abrir la foto. Prueba con JPG, PNG o WebP.");
    }
  }

  function chooseStyle(next: DensityStyle) {
    selectedStyle.current = next;
    setStyle(next);
    const mask = segmentation.current;
    if (mask) mask.density = prepareDensityMask(mask.source, next);
    const image = sourcePhoto.current;
    if (image) draw(image, image.width, image.height, false);
  }

  function close() {
    releaseCamera();
    sourcePhoto.current = null;
    clearPreview();
    setStatus("idle");
    setError("");
  }

  function adjustPoint(x: number, y: number) {
    manual.current = true;
    const previous = pose.current;
    updatePose({
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
      width: previous?.width ?? 0.3,
      height: previous?.height ?? 0.14,
      angle: previous?.angle ?? 0,
    });
    setTracking("manual");
    const image = sourcePhoto.current;
    if (image) draw(image, image.width, image.height, false);
  }

  function aim(event: MouseEvent<HTMLButtonElement>) {
    const canvas = afterCanvas.current;
    if (!canvas) return;
    if (event.detail > 0) {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const scale = Math.min(bounds.width / canvas.width, bounds.height / canvas.height);
      const width = canvas.width * scale;
      const height = canvas.height * scale;
      const x = (event.clientX - bounds.left - (bounds.width - width) / 2) / width;
      const y = (event.clientY - bounds.top - (bounds.height - height) / 2) / height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      adjustPoint(x, y + (pose.current?.height ?? 0.14) * 0.4);
    }
    stopAdjusting();
  }

  function stopAdjusting() {
    setAdjusting(false);
    aimToggle.current?.focus();
  }

  function aimWithKeys(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      stopAdjusting();
      return;
    }
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-0.025, 0], ArrowRight: [0.025, 0], ArrowUp: [0, -0.025], ArrowDown: [0, 0.025],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    adjustPoint(point.current.x + move[0], point.current.y + move[1]);
  }

  const active = status === "live" || status === "photo";
  const opened = active || status === "opening" || status === "loading-photo";

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  useEffect(() => {
    if (adjusting) aimSurface.current?.focus({ preventScroll: true });
  }, [adjusting]);

  return (
    <div id="como-te-verias" className="hair-mirror">
      {active ? (
        <div className="hair-style-picker" role="group" aria-label="Estilo de densidad">
          <button type="button" aria-pressed={style === "masculino"} onClick={() => chooseStyle("masculino")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16v-4a7 7 0 0 1 14 0v4M5 12l4-2 3 2 3-2 4 2" /></svg>
            <span><strong>Masculino</strong><small>Entradas y línea frontal</small></span>
          </button>
          <button type="button" aria-pressed={style === "femenino"} onClick={() => chooseStyle("femenino")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V12a7 7 0 0 1 14 0v8M12 5c0 5-3 8-7 10m7-10c0 5 3 8 7 10" /></svg>
            <span><strong>Femenino</strong><small>Raya y densidad superior</small></span>
          </button>
        </div>
      ) : null}
      <div id="espejo-capilar" className={active ? "lp-results-frame hair-mirror-live" : "lp-results-frame"} hidden={!example && !active}>
        {example && !active ? <span className="lp-badge">Foto real autorizada pendiente</span> : null}
        <CompareSlider
          label={active ? "Compara tu imagen sin filtro y con filtro" : example?.label ?? "Comparador capilar"}
          beforeLabel={active ? "Antes · Sin filtro" : "Antes"}
          afterLabel={active ? "Después · Con filtro" : "Después"}
          before={<><canvas ref={beforeCanvas} hidden={!active} aria-hidden="true" />{!active ? example?.before : null}</>}
          after={<><canvas ref={afterCanvas} hidden={!active} aria-hidden="true" />{!active ? example?.after : null}</>}
        />
        {active && adjusting ? (
          <button type="button" ref={aimSurface} className="hair-mirror-aim"
            onClick={aim} onKeyDown={aimWithKeys} aria-label="Toca tu cabello o ajusta el filtro con las flechas. Pulsa Intro para terminar.">
            <span>Toca tu cabello</span>
          </button>
        ) : null}
      </div>
      <div className="hair-mirror-actions">
        <button className="btn-coral" type="button" aria-controls="espejo-capilar" aria-expanded={opened} onClick={opened ? close : openCamera}>
          {opened ? status === "opening" ? "Cancelar cámara" : "Cerrar vista" : "Ver cómo se vería en mí"}
        </button>
        {active && maskStatus === "ready" ? (
          <button type="button" ref={aimToggle} className="hair-mirror-adjust" aria-pressed={adjusting}
            onClick={() => adjusting ? stopAdjusting() : setAdjusting(true)}>
            {adjusting ? "Listo" : "Ajustar zona"}
          </button>
        ) : null}
      </div>
      {active && maskStatus !== "error" && (tracking === "loading" || maskStatus === "loading") ? <p className="hair-mirror-message" role="status">Preparando el filtro…</p> : null}
      {active && tracking === "searching" && maskStatus === "ready" ? <p className="hair-mirror-message" role="status">Mira de frente y deja visible la línea del cabello.</p> : null}
      {active && tracking === "unavailable" && maskStatus === "ready" ? <p className="hair-mirror-message" role="status">Usa «Ajustar zona» para colocar el filtro.</p> : null}
      {active && maskStatus === "empty" ? <p className="hair-mirror-message" role="status">Acércate para que se vea el cabello.</p> : null}
      {active && maskStatus === "error" ? <p className="hair-mirror-message" role="status">El filtro no cargó. Cierra la vista e inténtalo de nuevo.</p> : null}
      {status === "opening" ? <p className="hair-mirror-message" role="status">Abriendo cámara…</p> : null}
      {status === "loading-photo" ? <p className="hair-mirror-message" role="status">Abriendo foto…</p> : null}
      <video ref={video} muted playsInline className="hair-mirror-source" aria-hidden="true" />
      {error ? (
        <div className="hair-mirror-message">
          <p role="alert">{error}</p>
          <button className="btn-line" type="button" onClick={() => fileInput.current?.click()}>Elegir una foto</button>
        </div>
      ) : null}
      <input ref={fileInput} type="file" accept="image/*" hidden onChange={(event) => {
        void openPhoto(event.target.files?.[0]);
        event.target.value = "";
      }} />
      <aside className="hair-mirror-notes" aria-label="Información del filtro">
        <details name="espejo-capilar-notas">
          <summary aria-label="Privacidad" title={privacyNote}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="11" width="12" height="9" rx="2" /><path d="M9 11V8a3 3 0 0 1 6 0v3" /></svg>
          </summary>
          <p>{privacyNote}</p>
        </details>
        <details name="espejo-capilar-notas">
          <summary aria-label="Sobre el filtro" title={filterNote}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 11v5m0-8v1" /></svg>
          </summary>
          <p>{filterNote}</p>
        </details>
      </aside>
    </div>
  );
}
