"use client";

import React, { useEffect, useRef } from "react";
import { PRESETS, PresetItem } from "../presets";
import { useReveal } from "./useReveal";

function PresetThumb({ preset }: { preset: PresetItem }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const size = 300;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    preset.draw(ctx, size, size);
  }, [preset]);

  return <canvas ref={ref} className="w-full h-full" aria-hidden="true" />;
}

export function Gallery({ onPick }: { onPick: (id: string) => void }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="gallery" ref={ref} className="section">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <span className="reveal eyebrow">Gallery</span>
          <h2 className="reveal heading-lg text-gradient mt-4">Not sure what to draw?</h2>
          <p className="reveal mt-4 text-zinc-400 leading-relaxed">
            Pick a starter sketch. It loads straight into the studio with a matching prompt, ready to generate.
          </p>
        </div>
        <a href="#studio" className="reveal btn-secondary self-start md:self-auto">
          Go to studio
        </a>
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
        {PRESETS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPick(p.id)}
            className="reveal group card p-3 text-left hover:border-brand-400/40 hover:-translate-y-0.5 transition-all duration-300"
            style={{ transitionDelay: `${(i % 3) * 80}ms` }}
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white">
              <div className="absolute inset-0 flex items-center justify-center p-2 group-hover:scale-[1.04] transition-transform duration-500">
                <div className="h-full aspect-square">
                  <PresetThumb preset={p} />
                </div>
              </div>
              <span className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 inline-flex items-center justify-center gap-1.5 h-8 rounded-full bg-studio-950/90 text-white text-xs font-medium backdrop-blur">
                Use this sketch →
              </span>
            </div>
            <div className="px-1.5 pt-3 pb-1 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  <span className="mr-1.5" aria-hidden="true">{p.emoji}</span>
                  {p.name}
                </p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{p.prompt}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
