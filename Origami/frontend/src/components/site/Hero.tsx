"use client";

import React from "react";
import { Logo } from "./Logo";
import { useReveal } from "./useReveal";

export function Hero() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-32 sm:pt-40 pb-16 sm:pb-24">
      <div className="absolute inset-0 dot-grid pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <a
            href="#how"
            className="reveal inline-flex items-center gap-2 h-8 pl-1 pr-3 rounded-full border border-line bg-surface text-xs text-fg hover:border-line-strong transition-colors"
          >
            <span className="px-2 py-0.5 rounded-full bg-fg text-canvas font-semibold">New</span>
            Gemini + TripoSG pipeline
            <span aria-hidden="true">→</span>
          </a>

          <h1 className="reveal heading-xl mt-6" style={{ transitionDelay: "80ms" }}>
            <span className="text-gradient">Sketch it.</span>
            <br />
            <span className="text-gradient-brand">Fold it into 3D.</span>
          </h1>

          <p
            className="reveal mt-6 text-base sm:text-lg text-fg-muted max-w-xl mx-auto lg:mx-0 leading-relaxed"
            style={{ transitionDelay: "160ms" }}
          >
            Origami turns a rough doodle into an interactive, downloadable 3D model. No modeling skills needed. Draw,
            hit generate, and export a GLB in about 30 seconds.
          </p>

          <div
            className="reveal mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            style={{ transitionDelay: "240ms" }}
          >
            <a href="#studio" className="btn-primary !h-12 !px-6">
              Start creating — it&apos;s free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </a>
            <a href="#how" className="btn-secondary !h-12 !px-6">
              See how it works
            </a>
          </div>

          <dl
            className="reveal mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 text-left"
            style={{ transitionDelay: "320ms" }}
          >
            {[
              ["~30s", "per mesh"],
              [".GLB", "ready export"],
              ["6", "starter presets"],
            ].map(([v, l]) => (
              <div key={l} className="border-l border-line pl-4">
                <dt className="font-display text-2xl font-semibold text-fg">{v}</dt>
                <dd className="text-xs text-fg-faint mt-1">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual: doodle → folded 3D */}
        <div className="reveal relative" style={{ transitionDelay: "200ms" }} aria-hidden="true">
          <div className="absolute -inset-10 bg-fg/5 blur-3xl rounded-full" />
          <div className="relative card p-6 sm:p-8">
            <div className="flex items-center gap-1.5 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
              <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
              <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
              <span className="ml-3 text-[11px] text-fg-faint font-mono">swan.png → swan.glb</span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              {/* 2D sketch */}
              <div className="aspect-square rounded-xl bg-white canvas-grid-bg flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-4/5 h-4/5">
                  <path
                    d="M30 130 L80 135 L160 120 L130 85 L70 85 Z M70 85 L45 35 L25 42 L55 95 M80 135 L100 40 L130 85 M100 40 L150 65"
                    fill="none"
                    stroke="#18181b"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="600"
                    className="animate-dash"
                  />
                </svg>
              </div>

              <div className="flex flex-col items-center gap-1 text-fg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
                <span className="text-[10px] font-mono text-fg-faint">AI</span>
              </div>

              {/* 3D result */}
              <div className="aspect-square rounded-xl bg-surface-2 border border-line flex items-center justify-center relative overflow-hidden">
                <div className="absolute bottom-3 w-2/3 h-3 rounded-full bg-black/30 blur-md" />
                <Logo className="w-3/5 h-3/5 animate-float text-fg drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]" />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-2 text-fg">
                <span className="w-1.5 h-1.5 rounded-full bg-fg" /> Mesh ready
              </span>
              <span className="text-fg-faint font-mono">100k faces · 28.4s</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
