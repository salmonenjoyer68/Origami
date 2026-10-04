"use client";

import React, { useState, useEffect, useRef } from "react";
import { DrawingCanvas } from "../components/DrawingCanvas";
import { Viewport3D } from "../components/Viewport3D";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Generate3DResponse {
  status: string;
  detected_label: string;
  glb_base64?: string;
  model_url?: string;
  inference_time_seconds: number;
  is_preview?: boolean;
}

export default function OrigamiApp() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [glbData, setGlbData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [removeBackground, setRemoveBackground] = useState<boolean>(true);
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Ref to hold the current blob URL for memory cleanup
  const currentBlobUrlRef = useRef<string | null>(null);

  // Check backend health on mount
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/health`, { method: "GET" });
        if (isMounted) setBackendOnline(res.ok);
      } catch {
        if (isMounted) setBackendOnline(false);
      }
    };
    checkHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Timer while generating
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isLoading) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds((sec) => sec + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  // Cleanup Blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
      }
    };
  }, []);

  // Convert base64 GLB string to browser Blob URL for the 3D viewer
  const convertBase64ToBlobUrl = (base64Data: string): string => {
    const cleanBase64 = base64Data.includes(",")
      ? base64Data.split(",")[1].trim()
      : base64Data.trim();

    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteNumbers], { type: "model/gltf-binary" });
    return URL.createObjectURL(blob);
  };

  // Trigger automatic download of the .glb file
  const handleDownload = () => {
    if (!glbData) return;

    // Strip data URL prefix if present
    const cleanBase64 = glbData.includes(",")
      ? glbData.split(",")[1].trim()
      : glbData.trim();

    // Convert base64 to binary Blob
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: "model/gltf-binary" });
    const blobUrl = URL.createObjectURL(blob);

    // Trigger download using an invisible anchor element
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "origami-model.glb";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();

    // Cleanup DOM and Blob URL
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  // Handle 3D Generation POST request
  const handleGenerate3D = async (imageBase64: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/generate-3d`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_base64: imageBase64,
          prompt: prompt.trim() || undefined,
          remove_background: removeBackground,
        }),
      });

      if (!response.ok) {
        let errorDetail = `Server error (${response.status})`;
        try {
          const errorJson = await response.json();
          if (errorJson?.detail) {
            errorDetail = errorJson.detail;
          }
        } catch {
          // ignore json parse error
        }
        throw new Error(errorDetail);
      }

      const data: Generate3DResponse = await response.json();

      if (!data.glb_base64) {
        throw new Error("Pipeline returned empty 3D model data");
      }

      // Store raw base64 GLB data for downloading
      setGlbData(data.glb_base64);

      // Revoke prior Blob URL and create new one for viewer
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
      }

      const newBlobUrl = convertBase64ToBlobUrl(data.glb_base64);
      currentBlobUrlRef.current = newBlobUrl;

      setModelUrl(newBlobUrl);
      setDetectedLabel(data.detected_label || null);
      setInferenceTime(data.inference_time_seconds || null);
      setIsPreview(!!data.is_preview);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to generate 3D model. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Origami
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI 2D → 3D
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Sketch a doodle to reconstruct an interactive 3D mesh
              </p>
            </div>
          </div>

          {/* Backend Status indicator */}
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                backendOnline === true
                  ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
                  : backendOnline === false
                  ? "bg-amber-500 shadow-sm shadow-amber-500/50"
                  : "bg-zinc-600"
              }`}
            />
            <span className="text-zinc-400 hidden sm:inline">
              Backend:{" "}
              {backendOnline === true
                ? "Connected"
                : backendOnline === false
                ? "Offline (port 8000)"
                : "Checking..."}
            </span>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Error Alert Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <svg
                className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-semibold text-red-300">Generation Error</p>
                <p className="text-red-300/80 mt-0.5 break-all">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200 p-1 rounded-md hover:bg-red-900/40 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ZeroGPU Quota Cooldown Notice */}
        {isPreview && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">⏳</span>
              <p>
                <strong className="font-semibold text-amber-300">
                  Hugging Face ZeroGPU Free Limit Reached:
                </strong>{" "}
                Your doodle was analyzed by Gemini, but Hugging Face&apos;s GPU queue
                is temporarily on cooldown. Showing a demo 3D mesh preview. Real
                generations will resume automatically once the GPU queue cools
                down.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className="text-amber-400 hover:text-amber-200 p-1 rounded-md hover:bg-amber-900/40 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: 2D Canvas */}
          <div className="w-full flex flex-col">
            <DrawingCanvas
              onGenerate={handleGenerate3D}
              isLoading={isLoading}
              prompt={prompt}
              setPrompt={setPrompt}
              removeBackground={removeBackground}
              setRemoveBackground={setRemoveBackground}
            />
          </div>

          {/* Right Column: 3D Viewer & Download Action */}
          <div className="w-full flex flex-col gap-3">
            <Viewport3D
              modelUrl={modelUrl}
              isLoading={isLoading}
              detectedLabel={detectedLabel}
              inferenceTime={inferenceTime}
              elapsedSeconds={elapsedSeconds}
            />

            {/* Download Model Button - Visible when glbData is available */}
            {glbData && (
              <div className="flex items-center justify-between px-2 pt-1 animate-fade-in">
                <span className="text-xs text-zinc-400">
                  Model ready for export
                </span>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-200 border border-indigo-400/20"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download .glb</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
