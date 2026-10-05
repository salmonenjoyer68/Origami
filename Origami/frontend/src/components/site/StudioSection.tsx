"use client";

import React from "react";
import { DrawingCanvas } from "../DrawingCanvas";
import { Viewport3D } from "../Viewport3D";
import { useReveal } from "./useReveal";

export interface StudioSectionProps {
  onGenerate: (imageBase64: string) => void;
  isLoading: boolean;
  prompt: string;
  setPrompt: (v: string) => void;
  removeBackground: boolean;
  setRemoveBackground: (v: boolean) => void;
  presetRequest: { id: string; nonce: number } | null;
  modelUrl: string | null;
  detectedLabel: string | null;
  inferenceTime: number | null;
  elapsedSeconds: number;
  error: string | null;
  onDismissError: () => void;
  isPreview: boolean;
  onDismissPreview: () => void;
  onLoadSample?: () => void;
}

function Banner({
  tone,
  title,
  children,
  onClose,
}: {
  tone: "error" | "warn";
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const styles =
    tone === "error"
      ? "border-fg bg-canvas text-fg"
      : "border-line-strong bg-surface-2 text-fg";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm animate-fade-in ${styles}`}>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 opacity-80 break-words">{children}</p>
      </div>
      <button type="button" onClick={onClose} className="icon-btn !h-7 !min-w-7 !text-current opacity-70 hover:opacity-100" aria-label="Dismiss">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function StudioSection(p: StudioSectionProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="studio" ref={ref} className="relative max-w-[1320px] mx-auto px-3 sm:px-6 py-20 sm:py-24">
      <div className="text-center max-w-2xl mx-auto px-2">
        <span className="reveal eyebrow">The studio</span>
        <h2 className="reveal heading-lg text-gradient mt-4">Draw on the left. Get 3D on the right.</h2>
        <p className="reveal mt-4 text-fg-muted">This is the real tool, not a demo video. Give it a try.</p>
      </div>

      {(p.error || p.isPreview) && (
        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {p.error && (
            <Banner tone="error" title="Generation failed" onClose={p.onDismissError}>
              {p.error}
            </Banner>
          )}
          {p.isPreview && (
            <Banner tone="warn" title="GPU queue is busy, so you're seeing a demo mesh" onClose={p.onDismissPreview}>
              Your sketch was analyzed, but the free Hugging Face GPU quota is cooling down. Try again in a few minutes
              for your real model.
            </Banner>
          )}
        </div>
      )}

      {/* App window frame */}
      <div className="reveal relative mt-10">
        <div className="absolute -inset-x-10 -inset-y-6 bg-fg/5 blur-3xl rounded-[40px] pointer-events-none" aria-hidden="true" />
        <div className="relative rounded-2xl border border-line bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="h-10 px-4 flex items-center gap-2 border-b border-line bg-surface-2">
            <span className="w-3 h-3 rounded-full bg-line-strong" />
            <span className="w-3 h-3 rounded-full bg-line-strong" />
            <span className="w-3 h-3 rounded-full bg-line-strong" />
            <span className="flex-1 text-center text-xs text-fg-faint font-medium -ml-12">Origami Studio</span>
          </div>

          <div className="grid lg:grid-cols-2 lg:divide-x divide-line">
            <div className="h-[640px] lg:h-[700px] border-b lg:border-b-0 border-line">
              <DrawingCanvas
                onGenerate={p.onGenerate}
                isLoading={p.isLoading}
                prompt={p.prompt}
                setPrompt={p.setPrompt}
                removeBackground={p.removeBackground}
                setRemoveBackground={p.setRemoveBackground}
                presetRequest={p.presetRequest}
              />
            </div>
            <div className="h-[560px] lg:h-[700px]">
              <Viewport3D
                modelUrl={p.modelUrl}
                isLoading={p.isLoading}
                detectedLabel={p.detectedLabel}
                inferenceTime={p.inferenceTime}
                elapsedSeconds={p.elapsedSeconds}
                onLoadSample={p.onLoadSample}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
