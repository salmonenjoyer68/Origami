"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { StudioHeader } from "../components/StudioHeader";
import { DrawingCanvas } from "../components/DrawingCanvas";
import { Viewport3D } from "../components/Viewport3D";
import { GuideDrawer } from "../components/GuideDrawer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Generate3DResponse {
  status: string;
  detected_label: string;
  glb_base64?: string;
  model_url?: string;
  inference_time_seconds: number;
  is_preview?: boolean;
}

function base64ToBlobUrl(base64Data: string): string {
  const clean = base64Data.includes(",") ? base64Data.split(",")[1].trim() : base64Data.trim();
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: "model/gltf-binary" }));
}

export default function OrigamiStudioPage() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [removeBackground, setRemoveBackground] = useState(true);
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [presetRequest, setPresetRequest] = useState<{ id: string; nonce: number } | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const blobUrlRef = useRef<string | null>(null);

  // Health check
  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/api/health`)
      .then((r) => mounted && setBackendOnline(r.ok))
      .catch(() => mounted && setBackendOnline(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Elapsed timer while generating
  useEffect(() => {
    if (!isLoading) return;
    setElapsedSeconds(0);
    const t = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isLoading]);

  // Clean up blob url on unmount
  useEffect(() => () => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
  }, []);

  const handleGenerate3D = useCallback(
    async (imageBase64: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/generate-3d`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_base64: imageBase64,
            prompt: prompt.trim() || undefined,
            remove_background: removeBackground,
          }),
        });

        if (!res.ok) {
          let detail = `Server error (${res.status})`;
          try {
            const j = await res.json();
            if (j?.detail) detail = j.detail;
          } catch {
            /* ignore */
          }
          throw new Error(detail);
        }

        const data: Generate3DResponse = await res.json();
        if (!data.glb_base64) throw new Error("The pipeline returned no 3D model data.");

        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        const url = base64ToBlobUrl(data.glb_base64);
        blobUrlRef.current = url;

        setModelUrl(url);
        setDetectedLabel(data.detected_label || null);
        setInferenceTime(data.inference_time_seconds ?? null);
        setIsPreview(!!data.is_preview);
        setBackendOnline(true);
      } catch (err: unknown) {
        const isNetwork = err instanceof TypeError;
        setError(
          isNetwork
            ? `Couldn't reach the backend at ${API_BASE}. Is the FastAPI server running?`
            : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
        if (isNetwork) setBackendOnline(false);
      } finally {
        setIsLoading(false);
      }
    },
    [prompt, removeBackground]
  );

  const handleLoadSample = useCallback(() => {
    setModelUrl("/samples/sample_model.glb");
    setDetectedLabel("Origami Crane Demo");
    setInferenceTime(1.8);
    setIsPreview(true);
    setError(null);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-studio-950 text-zinc-100 overflow-hidden font-sans">
      {/* Header */}
      <StudioHeader
        backendOnline={backendOnline}
        onLoadSample={handleLoadSample}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Status / Alert Banners */}
      {(error || isPreview) && (
        <div className="shrink-0 px-4 py-2 text-xs flex items-center justify-between gap-3 border-b border-white/[0.08] bg-black/40 backdrop-blur z-20">
          {error && (
            <div className="flex items-center gap-2 text-rose-300">
              <span className="font-semibold text-rose-400">Error:</span>
              <span className="truncate">{error}</span>
            </div>
          )}
          {!error && isPreview && (
            <div className="flex items-center gap-2 text-amber-300">
              <span className="font-semibold text-amber-400">Notice:</span>
              <span>GPU queue is busy, displaying preview demo mesh. Real generation will retry when queue clears.</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setIsPreview(false);
            }}
            className="icon-btn !h-6 !px-2 text-[11px] text-zinc-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Dual-Pane Viewport */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] overflow-hidden">
        {/* Left Column: 2D Canvas */}
        <div className="h-full min-h-0 overflow-hidden">
          <DrawingCanvas
            onGenerate={handleGenerate3D}
            isLoading={isLoading}
            prompt={prompt}
            setPrompt={setPrompt}
            removeBackground={removeBackground}
            setRemoveBackground={setRemoveBackground}
            presetRequest={presetRequest}
          />
        </div>

        {/* Right Column: 3D Viewport */}
        <div className="h-full min-h-0 overflow-hidden">
          <Viewport3D
            modelUrl={modelUrl}
            isLoading={isLoading}
            detectedLabel={detectedLabel}
            inferenceTime={inferenceTime}
            elapsedSeconds={elapsedSeconds}
            onLoadSample={handleLoadSample}
          />
        </div>
      </main>

      {/* Slide-over Guide & FAQ Drawer */}
      <GuideDrawer
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}