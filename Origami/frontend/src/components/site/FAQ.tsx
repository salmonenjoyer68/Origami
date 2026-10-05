"use client";

import React from "react";
import { useReveal } from "./useReveal";

const FAQS = [
  {
    q: "Do I need to be good at drawing?",
    a: "No. Simple, clear outlines work best. Closed shapes and a single main object give the most reliable results. You can also start from a preset or upload a photo.",
  },
  {
    q: "How long does a generation take?",
    a: "Usually 20–60 seconds. Most of that time is the 3D reconstruction step on a GPU. The studio shows each stage while you wait.",
  },
  {
    q: "Why did I get a demo mesh instead of my model?",
    a: "The public Hugging Face GPU queue has a free usage limit. When it's busy, Origami still analyzes your sketch but shows a sample mesh so you're not left with nothing. Try again in a few minutes.",
  },
  {
    q: "What can I do with the exported file?",
    a: "The .glb format is an industry standard. Import it into Blender, Unity, Unreal, Three.js, or most online 3D viewers.",
  },
  {
    q: "Is my drawing stored anywhere?",
    a: "The backend processes your image only to generate the model and doesn't keep a gallery of uploads. Generated files live in your browser until you download them.",
  },
];

export function FAQ() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="faq" ref={ref} className="section">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
        <div>
          <span className="reveal eyebrow">FAQ</span>
          <h2 className="reveal heading-lg text-gradient mt-4">Questions, answered</h2>
          <p className="reveal mt-4 text-fg-muted leading-relaxed">
            Anything else? Check the README in the repository for setup and API details.
          </p>
        </div>

        <div className="reveal divide-y divide-line border-y border-line">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-center justify-between gap-6 cursor-pointer text-fg font-medium hover:opacity-70 transition-opacity">
                {f.q}
                <span className="shrink-0 w-7 h-7 rounded-full border border-line flex items-center justify-center text-fg-muted group-open:rotate-45 group-open:text-fg group-open:border-fg transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 pr-12 text-sm text-fg-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
