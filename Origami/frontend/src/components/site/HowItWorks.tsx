"use client";

import React from "react";
import { useReveal } from "./useReveal";

const STEPS = [
  {
    n: "01",
    title: "Sketch your idea",
    body: "Draw freehand, pick a starter preset, or drop in a photo. Rough lines are fine.",
    icon: "M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.5 2.5 0 113.536 3.536L12.536 14.5H9V11z M4 20h16",
  },
  {
    n: "02",
    title: "AI understands it",
    body: "Gemini works out what you drew and cleans up the background so the shape is clear.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
  {
    n: "03",
    title: "Get a real 3D model",
    body: "TripoSG builds a full mesh. Orbit it, relight it, then export a .GLB or a PNG render.",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
];

export function HowItWorks() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="how" ref={ref} className="section">
      <div className="text-center max-w-2xl mx-auto">
        <span className="reveal eyebrow">How it works</span>
        <h2 className="reveal heading-lg text-gradient mt-4">From napkin doodle to 3D asset in three steps</h2>
      </div>

      <ol className="relative mt-16 grid md:grid-cols-3 gap-5">
        <div
          className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
          aria-hidden="true"
        />
        {STEPS.map((s, i) => (
          <li key={s.n} className="reveal card p-7 relative" style={{ transitionDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-surface border border-line flex items-center justify-center text-fg relative z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d={s.icon} />
                </svg>
              </div>
              <span className="font-mono text-sm text-fg-faint">{s.n}</span>
            </div>
            <h3 className="mt-6 font-display text-lg font-semibold text-fg">{s.title}</h3>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
