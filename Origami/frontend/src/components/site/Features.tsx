"use client";

import React from "react";
import { useReveal } from "./useReveal";

const FEATURES = [
  {
    title: "One-click presets",
    body: "Six starter doodles — mug, chair, swan, rocket, crown, sword — each with a tuned prompt.",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    span: "md:col-span-2",
  },
  {
    title: "Studio lighting",
    body: "Switch between softbox, neon and clay to check form and silhouette.",
    icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    span: "",
  },
  {
    title: "GLB export",
    body: "Download a standard .glb that opens in Blender, Unity, Three.js and more.",
    icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
    span: "",
  },
  {
    title: "Snapshot renders",
    body: "Save a PNG of the viewport for thumbnails, decks or sharing.",
    icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
    span: "",
  },
  {
    title: "Auto background removal",
    body: "Segmentation isolates your subject before reconstruction for cleaner geometry.",
    icon: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z",
    span: "",
  },
  {
    title: "Keyboard-first",
    body: "Ctrl + Enter to generate, plus undo, drag-and-drop upload and camera snaps.",
    icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    span: "md:col-span-2",
  },
];

export function Features() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="features" ref={ref} className="section">
      <div className="max-w-2xl">
        <span className="reveal eyebrow">Features</span>
        <h2 className="reveal heading-lg text-gradient mt-4">Everything you need, nothing you don&apos;t</h2>
        <p className="reveal mt-4 text-zinc-400 leading-relaxed">
          A focused toolset for going from idea to usable 3D asset, without learning a modeling package.
        </p>
      </div>

      <div className="mt-14 grid md:grid-cols-4 gap-4">
        {FEATURES.map((f, i) => (
          <article
            key={f.title}
            className={`reveal card p-6 group hover:-translate-y-0.5 hover:border-brand-400/30 transition-all duration-300 ${f.span}`}
            style={{ transitionDelay: `${(i % 3) * 80}ms` }}
          >
            <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 group-hover:text-brand-300 group-hover:border-brand-400/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d={f.icon} />
              </svg>
            </div>
            <h3 className="mt-5 font-semibold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
