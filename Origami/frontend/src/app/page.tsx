"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "../components/site/Navbar";
import { Hero } from "../components/site/Hero";
import { HowItWorks } from "../components/site/HowItWorks";
import { StudioSection } from "../components/site/StudioSection";
import { Features } from "../components/site/Features";
import { Gallery } from "../components/site/Gallery";
import { FAQ } from "../components/site/FAQ";
import { CTA, Footer } from "../components/site/Footer";

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

export default function OrigamiPage() {
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

  const blobUrlRef = useRef<string | null>(null);

  // Backend health check on mount
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

  // Revoke the last Blob URL on unmount
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

  const handlePickPreset = useCallback((id: string) => {
    setPresetRequest({ id, nonce: Date.now() });
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleLoadSample = useCallback(() => {
    setModelUrl("/samples/sample_model.glb");
    setDetectedLabel("Origami Crane Demo");
    setInferenceTime(1.8);
    setIsPreview(true);
    setError(null);
  }, []);

  return (
    <div className="page-bg min-h-screen">
      <Navbar backendOnline={backendOnline} />
      <main>
        <Hero />
        <HowItWorks />
        <StudioSection
          onGenerate={handleGenerate3D}
          isLoading={isLoading}
          prompt={prompt}
          setPrompt={setPrompt}
          removeBackground={removeBackground}
          setRemoveBackground={setRemoveBackground}
          presetRequest={presetRequest}
          modelUrl={modelUrl}
          detectedLabel={detectedLabel}
          inferenceTime={inferenceTime}
          elapsedSeconds={elapsedSeconds}
          error={error}
          onDismissError={() => setError(null)}
          isPreview={isPreview}
          onDismissPreview={() => setIsPreview(false)}
          onLoadSample={handleLoadSample}
        />
        <Features />
        <Gallery onPick={handlePickPreset} />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}