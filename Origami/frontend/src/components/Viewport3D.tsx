"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import type { ModelViewerProps, LightingMode } from "./ModelViewer";

// Dynamically import ModelViewer with SSR disabled to prevent hydration mismatch
const DynamicModelViewer = dynamic<ModelViewerProps>(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin" />
      <span className="text-xs text-zinc-500">Starting 3D viewport…</span>
    </div>
  ),
});

interface Viewport3DProps {
  modelUrl: string | null;
  isLoading: boolean;
  detectedLabel: string | null;
  inferenceTime: number | null;
  elapsedSeconds: number;
  onLoadSample?: () => void;
}

const STAGES = [
  { label: "Understanding your sketch", sub: "Gemini vision", until: 4 },
  { label: "Isolating the subject", sub: "Background segmentation", until: 9 },
  { label: "Building the 3D mesh", sub: "TripoSG reconstruction", until: Infinity },
];

const LIGHTS: { id: LightingMode; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "neon", label: "Neon" },
  { id: "warm", label: "Warm" },
  { id: "clay", label: "Clay" },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function Viewport3D({
  modelUrl,
  isLoading,
  detectedLabel,
  inferenceTime,
  elapsedSeconds,
  onLoadSample,
}: Viewport3DProps) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingMode, setLightingMode] = useState<LightingMode>("studio");
  const [cameraPreset, setCameraPreset] = useState<"iso" | "front" | "top" | null>("iso");
  const [cameraNonce, setCameraNonce] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const captureRef = useRef<(() => string | null) | null>(null);

  const download = (href: string, filename: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownload = () => {
    if (!modelUrl) return;
    download(modelUrl, detectedLabel ? `origami-${slug(detectedLabel)}.glb` : "origami-model.glb");
  };

  const handleSnapshot = () => {
    const dataUrl = captureRef.current?.();
    if (dataUrl) download(dataUrl, detectedLabel ? `origami-render-${slug(detectedLabel)}.png` : "origami-render.png");
  };

  const snap = (p: "iso" | "front" | "top") => {
    setCameraPreset(p);
    setCameraNonce((n) => n + 1);
  };

  const activeStage = STAGES.findIndex((s) => elapsedSeconds < s.until);

  return (
    <div
      className={`flex flex-col bg-studio-950 overflow-hidden ${
        isFullscreen ? "fixed inset-3 sm:inset-6 z-[60] rounded-2xl border border-white/10 shadow-2xl" : "w-full h-full"
      }`}
    >
      {/* Toolbar */}
      <div className="px-3 h-12 border-b border-white/[0.06] flex items-center justify-between gap-2 bg-studio-900">
        <div className="segmented" role="radiogroup" aria-label="Lighting">
          {LIGHTS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={lightingMode === l.id}
              data-active={lightingMode === l.id}
              onClick={() => setLightingMode(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`icon-btn text-xs font-medium ${wireframe ? "!text-brand-200 !bg-brand-500/15" : ""}`}
            onClick={() => setWireframe((v) => !v)}
            aria-pressed={wireframe}
            title="Toggle wireframe"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 0v18M4 7.5l16 9M20 7.5l-16 9" />
            </svg>
          </button>
          <button
            type="button"
            className={`icon-btn ${autoRotate ? "!text-brand-200 !bg-brand-500/15" : ""}`}
            onClick={() => setAutoRotate((v) => !v)}
            aria-pressed={autoRotate}
            title="Toggle auto-rotate"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsFullscreen((v) => !v)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 9H4m5 0V4m6 5h5m-5 0V4M9 15H4m5 0v5m6-5h5m-5 0v5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 min-h-0 bg-[radial-gradient(ellipse_at_center,#1a1a22_0%,#070709_70%)]">
        <DynamicModelViewer
          modelUrl={modelUrl}
          isLoading={isLoading}
          wireframe={wireframe}
          autoRotate={autoRotate}
          lightingMode={lightingMode}
          cameraPreset={cameraPreset}
          cameraNonce={cameraNonce}
          onCaptureRef={captureRef}
        />

        {/* Overlays */}
        <div className="absolute top-3 left-3 segmented !bg-studio-950/70 backdrop-blur" aria-label="Camera view">
          {(["iso", "front", "top"] as const).map((p) => (
            <button key={p} type="button" onClick={() => snap(p)} className="!h-6 !px-2 !text-[11px] capitalize">
              {p === "iso" ? "Iso" : p}
            </button>
          ))}
        </div>

        {detectedLabel && !isLoading && (
          <span className="absolute top-3 right-3 max-w-[55%] truncate h-7 px-3 inline-flex items-center rounded-full bg-studio-950/70 backdrop-blur border border-brand-400/25 text-xs font-medium text-brand-200">
            {detectedLabel}
          </span>
        )}

        {!modelUrl && !isLoading && (
          <div className="absolute bottom-4 inset-x-0 flex flex-col items-center gap-2 z-10 px-4 text-center">
            <p className="text-xs text-zinc-500">
              Your model will appear here · drag to orbit · scroll to zoom
            </p>
            {onLoadSample && (
              <button
                type="button"
                onClick={onLoadSample}
                className="btn-secondary !h-8 !px-3.5 !text-xs !bg-brand-500/10 !border-brand-500/30 !text-brand-300 hover:!bg-brand-500/20 active:scale-95 transition-all shadow-sm"
              >
                <span>⚡</span>
                <span>Load Demo 3D Model</span>
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-studio-950/80 backdrop-blur-md p-6 animate-fade-in">
            <div className="w-full max-w-xs">
              <div className="flex items-baseline justify-between mb-5">
                <h4 className="font-display text-base font-semibold text-white">Generating</h4>
                <span className="font-mono text-sm text-brand-300 tabular-nums">{elapsedSeconds}s</span>
              </div>
              <ol className="space-y-4">
                {STAGES.map((s, i) => {
                  const done = i < activeStage;
                  const active = i === activeStage;
                  return (
                    <li key={s.label} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center border ${
                          done
                            ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300"
                            : active
                            ? "border-brand-400"
                            : "border-white/15"
                        }`}
                      >
                        {done ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : active ? (
                          <span className="w-2.5 h-2.5 border-2 border-brand-300/40 border-t-brand-300 rounded-full animate-spin" />
                        ) : null}
                      </span>
                      <div>
                        <p className={`text-sm ${done || active ? "text-white" : "text-zinc-500"}`}>{s.label}</p>
                        <p className="text-xs text-zinc-500">{s.sub}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-6 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-violet-400 transition-all duration-1000"
                  style={{ width: `${Math.min(95, (elapsedSeconds / 40) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 h-14 border-t border-white/[0.06] flex items-center justify-between gap-2 bg-studio-900">
        <div className="text-xs min-w-0">
          {modelUrl ? (
            <span className="inline-flex items-center gap-2 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Ready
              {inferenceTime != null && <span className="text-zinc-500 font-mono">· {inferenceTime.toFixed(1)}s</span>}
            </span>
          ) : (
            <span className="text-zinc-500">No model yet</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSnapshot}
            disabled={isLoading}
            className="btn-secondary !h-9 !px-3.5 !text-xs disabled:opacity-40"
            title="Save a PNG of the viewport"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">PNG</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!modelUrl || isLoading}
            className="btn-primary !h-9 !px-4 !text-xs disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .GLB
          </button>
        </div>
      </div>
    </div>
  );
}
