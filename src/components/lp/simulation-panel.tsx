"use client";

import { applyDensity, photoCanvas, readPhoto, type DensityOptions } from "@/lib/simulation/provider";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { CompareSlider } from "./compare-slider";

const defaults: DensityOptions = { x: 0.5, y: 0.28, size: 0.16, intensity: 65 };

export function SimulationPanel() {
  const [open, setOpen] = useState(false);
  return (
    <section id="como-te-verias" className="lp-band density-band" data-reveal>
      <div className="density-intro">
        <span className="density-symbol" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 8h4l2-3h4l2 3h4v11H4z" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </span>
        <div>
          <h2 className="display">¿Cómo te verías con más densidad?</h2>
          <p>Usa tu cámara o una foto, marca la zona que te preocupa y compara el cambio con un filtro visual.</p>
        </div>
        <button className="btn-coral" type="button" aria-expanded={open} aria-controls={open ? "simulacion" : undefined} onClick={() => setOpen(!open)}>
          {open ? "Cerrar simulación" : "Probar con mi foto"}
        </button>
      </div>
      <p className="lp-disclaimer">Simulación ilustrativa. Tu valoración permite explorar opciones para tu caso.</p>
      {open ? <PhotoStudio /> : null}
    </section>
  );
}

function PhotoStudio() {
  const [consent, setConsent] = useState(false);
  const [camera, setCamera] = useState<"off" | "opening" | "live">("off");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<HTMLCanvasElement | null>(null);
  const [options, setOptions] = useState(defaults);
  const [original, setOriginal] = useState("");
  const [filtered, setFiltered] = useState<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const request = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.getElementById("density-consent")?.focus({ preventScroll: true });
    document.getElementById("simulacion")?.scrollIntoView({ block: "nearest" });
    return () => {
      request.current += 1;
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!photo) return;
    const update = window.requestAnimationFrame(() => {
      try {
        setFiltered(applyDensity(photo, options));
      } catch {
        setError("No se pudo aplicar el filtro. Prueba con otra foto.");
      }
    });
    return () => window.cancelAnimationFrame(update);
  }, [photo, options]);

  function stopCamera() {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamera("off");
    setReady(false);
  }

  function acceptPhoto(next: HTMLCanvasElement) {
    setOriginal(next.toDataURL("image/jpeg", 0.92));
    setFiltered(null);
    setOptions(defaults);
    setPhoto(next);
    setError("");
  }

  async function openCamera() {
    if (!consent) return;
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("La cámara no está disponible aquí. Puedes elegir una foto de tu dispositivo.");
      return;
    }
    const id = ++request.current;
    setCamera("opening");
    try {
      const next = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "user" }, width: { ideal: 960 }, height: { ideal: 960 } },
      });
      const video = videoRef.current;
      if (request.current !== id || !video) {
        next.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = next;
      video.srcObject = next;
      await video.play();
      if (request.current === id) setCamera("live");
    } catch (cause) {
      if (request.current !== id) return;
      stopCamera();
      const denied = cause instanceof DOMException && cause.name === "NotAllowedError";
      setError(denied
        ? "El navegador bloqueó la cámara. Puedes darle permiso o elegir una foto."
        : "No pudimos abrir la cámara. Puedes elegir una foto de tu dispositivo.");
    }
  }

  function capture() {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    try {
      acceptPhoto(photoCanvas(video, video.videoWidth, video.videoHeight));
      stopCamera();
    } catch {
      setError("No pudimos tomar la foto. Intenta de nuevo o elige un archivo.");
    }
  }

  async function loadFile(file: File | undefined) {
    if (!file || !consent) return;
    const id = ++request.current;
    stopCamera();
    setBusy(true);
    setError("");
    try {
      const next = await readPhoto(file);
      if (request.current === id) acceptPhoto(next);
    } catch {
      if (request.current === id) setError("No pudimos leer esa imagen. Prueba con una foto JPG, PNG o WebP.");
    } finally {
      if (request.current === id) setBusy(false);
    }
  }

  function clearPhoto() {
    request.current += 1;
    stopCamera();
    setBusy(false);
    setPhoto(null);
    setOriginal("");
    setFiltered(null);
    setError("");
  }

  function point(x: number, y: number) {
    setOptions((current) => ({ ...current, x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }));
  }

  function pointFromClick(event: MouseEvent<HTMLButtonElement>) {
    if (event.detail === 0) return;
    const box = event.currentTarget.getBoundingClientRect();
    point((event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height);
  }

  function pointFromKeys(event: KeyboardEvent<HTMLButtonElement>) {
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-0.025, 0], ArrowRight: [0.025, 0], ArrowUp: [0, -0.025], ArrowDown: [0, 0.025],
    };
    const move = directions[event.key];
    if (!move) return;
    event.preventDefault();
    point(options.x + move[0], options.y + move[1]);
  }

  return (
    <div id="simulacion" className="density-studio">
      <label className="lp-consent">
        <input id="density-consent" type="checkbox" checked={consent} onChange={(event) => {
          setConsent(event.target.checked);
          if (!event.target.checked) clearPhoto();
        }} />
        <span>Acepto usar mi foto en este dispositivo. La imagen no se envía ni se guarda.</span>
      </label>
      <div className="density-actions">
        {camera === "off" ? (
          <button className="btn-line" type="button" onClick={openCamera} disabled={!consent || busy}>
            {photo ? "Tomar otra foto" : "Abrir cámara"}
          </button>
        ) : (
          <button className="btn-line" type="button" onClick={() => { request.current += 1; stopCamera(); }}>Cancelar cámara</button>
        )}
        <button className="btn-line" type="button" disabled={!consent || busy} onClick={() => fileInput.current?.click()}>Elegir una foto</button>
        <input ref={fileInput} hidden type="file" accept="image/*" onChange={(event) => {
          void loadFile(event.target.files?.[0]);
          event.target.value = "";
        }} />
        {photo ? <button className="density-clear" type="button" onClick={clearPhoto}>Quitar foto</button> : null}
      </div>
      {error ? <p className="lp-error" role="alert">{error}</p> : null}
      {busy ? <p role="status">Preparando la foto…</p> : null}
      {camera === "opening" ? <p role="status">Abriendo la cámara. Revisa si tu navegador solicita permiso.</p> : null}
      <div className="density-camera" hidden={camera === "off"}>
        <video ref={videoRef} muted playsInline onLoadedData={() => setReady(true)} aria-label="Vista en vivo de tu cámara" />
        <div>
          <p>Busca buena luz y encuadra la zona del cabello que quieres ver.</p>
          <button className="btn-coral" type="button" disabled={!ready || camera !== "live"} onClick={capture}>Capturar foto</button>
        </div>
      </div>
      {photo && original && camera === "off" ? (
        <div className="density-workspace">
          <div className="density-tools">
            <h3>Marca la zona en tu foto</h3>
            <p id="density-instructions">Toca el cabello donde quieres aplicar el filtro. También puedes mover el marcador con las flechas del teclado.</p>
            <button className="density-photo-select" type="button" aria-label="Posición del filtro" aria-describedby="density-instructions" onClick={pointFromClick} onKeyDown={pointFromKeys}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={original} alt="" width={photo.width} height={photo.height} />
              <span aria-hidden="true" style={{
                left: `${options.x * 100}%`, top: `${options.y * 100}%`,
                width: `${options.size * 200 * Math.min(photo.width, photo.height) / photo.width}%`,
                height: `${options.size * 136 * Math.min(photo.width, photo.height) / photo.height}%`,
              }} />
            </button>
            <label>Intensidad <input type="range" min={0} max={100} value={options.intensity} onChange={(event) => setOptions({ ...options, intensity: Number(event.target.value) })} /></label>
            <label>Tamaño de la zona <input type="range" min={7} max={34} value={Math.round(options.size * 100)} onChange={(event) => setOptions({ ...options, size: Number(event.target.value) / 100 })} /></label>
          </div>
          <div className="density-comparison">
            <h3>Compara tu foto</h3>
            {filtered ? (
              <CompareSlider
                label="Desliza para comparar la foto original con el filtro de densidad"
                beforeLabel="Original" afterLabel="Con filtro"
                aspectRatio={photo.width / photo.height}
                before={
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={original} alt="" />
                }
                after={<CanvasPreview source={filtered} />}
              />
            ) : !error ? <p role="status">Aplicando el filtro…</p> : null}
            <p>El filtro cambia el aspecto de la zona marcada. Los resultados de un tratamiento varían según cada persona.</p>
            <a className="btn-coral" href="#valoracion">Agendar mi valoración capilar</a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CanvasPreview({ source }: { source: HTMLCanvasElement }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    ref.current?.getContext("2d")?.drawImage(source, 0, 0);
  }, [source]);

  return <canvas ref={ref} width={source.width} height={source.height} aria-hidden="true" />;
}
