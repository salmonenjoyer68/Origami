"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import type { ModelViewerProps } from "./ModelViewer";

// Dynamically import ModelViewer with SSR disabled to prevent WebGL/Canvas hydration mismatch
const DynamicModelViewer = dynamic<ModelViewerProps>(
  () => import("./ModelViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-wider font-medium">
          Initializing 3D Viewport...
        </span>
      </div>
    ),
  }
);

interface Viewport3DProps {
  modelUrl: string | null;
  isLoading: boolean;
  detectedLabel: string | null;
  inferenceTime: number | null;
  elapsedSeconds: number;
}

export function Viewport3D({
  modelUrl,
  isLoading,
  detectedLabel,
  inferenceTime,
  elapsedSeconds,
}: Viewport3DProps) {
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const handleDownload = () => {
    if (!modelUrl) return;
    const a = document.createElement("a");
    a.href = modelUrl;
    const filename = detectedLabel
      ? `origami-${detectedLabel.toLowerCase().replace(/\s+/g, "-")}.glb`
      : "origami-model.glb";
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] bg-zinc-950/80 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            3D Viewport
          </span>
          {detectedLabel && !isLoading && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {detectedLabel}
            </span>
          )}
        </div>

        {/* Viewport Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setWireframe((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              wireframe
                ? "bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/30"
                : "bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:bg-zinc-700/80"
            }`}
          >
            Wireframe
          </button>
          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              autoRotate
                ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
            }`}
          >
            Rotate {autoRotate ? "On" : "Off"}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div className="flex-1 w-full h-full pt-12 pb-14">
        <DynamicModelViewer
          modelUrl={modelUrl}
          isLoading={isLoading}
          wireframe={wireframe}
          autoRotate={autoRotate}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-md gap-4 px-6 text-center animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-semibold text-indigo-400">
              {elapsedSeconds}s
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-zinc-100">
              Generating 3D Mesh...
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs">
              TripoSG transformer is predicting geometry and textures from your
              doodle.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Status / Footer Bar */}
      <div className="absolute bottom-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 bg-zinc-900/70 backdrop-blur-md border-t border-zinc-800/80 text-xs">
        <div className="text-zinc-500 flex items-center gap-2">
          {modelUrl ? (
            <>
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Model Ready
              </span>
              {inferenceTime && (
                <span className="text-zinc-500">
                  ({inferenceTime.toFixed(1)}s)
                </span>
              )}
            </>
          ) : (
            <span>Left-click & drag to rotate • Scroll to zoom</span>
          )}
        </div>

        {modelUrl && (
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <svg
              className="w-3.5 h-3.5"
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
            Download .GLB
          </button>
        )}
      </div>
    </div>
  );
}
