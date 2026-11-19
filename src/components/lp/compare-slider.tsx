"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function CompareSlider({
  before,
  after,
  label,
  beforeLabel = "Antes",
  afterLabel = "Después",
}: {
  before: ReactNode;
  after: ReactNode;
  label: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(56);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const measure = () => setWidth(node.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="compare" ref={box}>
      <div className="compare-layer">{after}</div>
      <div className="compare-clip" style={{ width: `${pos}%` }}>
        <div className="compare-full" style={{ width: width || "100%" }}>
          {before}
        </div>
      </div>
      <span className="compare-tag is-before">{beforeLabel}</span>
      <span className="compare-tag is-after">{afterLabel}</span>
      <span className="compare-handle" style={{ left: `${pos}%` }} aria-hidden="true">
        <i>
          <svg viewBox="0 0 24 24">
            <path d="M9 7 5 12l4 5M15 7l4 5-4 5" />
          </svg>
        </i>
      </span>
      <input
        className="compare-range"
        type="range"
        min={8}
        max={92}
        value={pos}
        aria-label={label}
        aria-valuemin={8}
        aria-valuemax={92}
        aria-valuenow={pos}
        aria-valuetext={`División al ${pos} por ciento`}
        onChange={(event) => setPos(Number(event.target.value))}
      />
    </div>
  );
}
