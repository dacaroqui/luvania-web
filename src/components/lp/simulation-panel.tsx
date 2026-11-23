"use client";

import { paintDensity, readPhoto } from "@/lib/simulation/provider";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

const initialPoint = { x: 0.5, y: 0.24 };
const previewSize = 540;
const frameInterval = 1000 / 30;
const privacyNote = "Tu imagen se queda en el dispositivo. No se guarda ni se envía.";
const filterNote = "Filtro ilustrativo. No predice resultados de un tratamiento.";
type Status = "idle" | "opening" | "live" | "loading-photo" | "photo" | "error";

export function SimulationPanel() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const frame = useRef(0);
  const session = useRef(0);
  const sourcePhoto = useRef<HTMLCanvasElement | null>(null);
  const point = useRef(initialPoint);

  const releaseCamera = useCallback(() => {
    session.current += 1;
    window.cancelAnimationFrame(frame.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
  }, []);

  useEffect(() => {
    function closeOnPageHide() {
      releaseCamera();
      sourcePhoto.current = null;
      if (canvas.current) canvas.current.width = 1;
      setStatus("idle");
    }
    window.addEventListener("pagehide", closeOnPageHide);
    return () => {
      window.removeEventListener("pagehide", closeOnPageHide);
      releaseCamera();
    };
  }, [releaseCamera]);

  function fail(message: string) {
    releaseCamera();
    sourcePhoto.current = null;
    if (canvas.current) canvas.current.width = 1;
    setError(message);
    setStatus("error");
  }

  function draw(source: CanvasImageSource, width: number, height: number, mirror: boolean) {
    const target = canvas.current;
    if (!target || !width || !height) return;
    const scale = Math.min(1, previewSize / Math.max(width, height));
    const outputWidth = Math.max(1, Math.round(width * scale));
    const outputHeight = Math.max(1, Math.round(height * scale));
    if (target.width !== outputWidth) target.width = outputWidth;
    if (target.height !== outputHeight) target.height = outputHeight;
    const ctx = target.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas no disponible");

    ctx.setTransform(mirror ? -1 : 1, 0, 0, 1, mirror ? outputWidth : 0, 0);
    ctx.drawImage(source, 0, 0, outputWidth, outputHeight);
    ctx.resetTransform();
    paintDensity(ctx, { ...point.current, size: 0.19, intensity: 70 });
  }

  async function openCamera() {
    setError("");
    sourcePhoto.current = null;
    point.current = initialPoint;

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

      let previous = -Infinity;
      let shown = false;
      const render = (now: number) => {
        if (session.current !== id) return;
        if (element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && element.videoWidth && now - previous >= frameInterval) {
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
    try {
      const image = await readPhoto(file);
      if (session.current !== id) return;
      point.current = initialPoint;
      sourcePhoto.current = image;
      draw(image, image.width, image.height, false);
      setStatus("photo");
    } catch {
      if (session.current === id) fail("No pudimos abrir la foto. Prueba con JPG, PNG o WebP.");
    }
  }

  function close() {
    releaseCamera();
    sourcePhoto.current = null;
    if (canvas.current) canvas.current.width = 1;
    setStatus("idle");
    setError("");
  }

  function adjustPoint(x: number, y: number) {
    point.current = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
    const image = sourcePhoto.current;
    if (image) draw(image, image.width, image.height, false);
  }

  function aim(event: MouseEvent<HTMLButtonElement>) {
    if (event.detail === 0 || !canvas.current) return;
    const bounds = canvas.current.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    adjustPoint((event.clientX - bounds.left) / bounds.width, (event.clientY - bounds.top) / bounds.height);
  }

  function aimWithKeys(event: KeyboardEvent<HTMLButtonElement>) {
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

  return (
    <div id="como-te-verias" className="hair-mirror">
      <button className="btn-coral" type="button" aria-controls="espejo-capilar" aria-expanded={opened} onClick={opened ? close : openCamera}>
        {opened ? status === "opening" ? "Cancelar cámara" : "Cerrar vista" : "Ver cómo se vería en mí"}
      </button>
      {status === "opening" ? <p className="hair-mirror-message" role="status">Abriendo cámara…</p> : null}
      {status === "loading-photo" ? <p className="hair-mirror-message" role="status">Abriendo foto…</p> : null}
      <div id="espejo-capilar" className="hair-mirror-view" hidden={!active}>
        <button type="button" className="hair-mirror-frame" onClick={aim} onKeyDown={aimWithKeys}
          aria-label="Vista con filtro capilar. Toca el cabello o usa las flechas para mover el filtro."
          title="Toca tu cabello para mover el filtro">
          <canvas ref={canvas} aria-hidden="true" />
        </button>
      </div>
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
