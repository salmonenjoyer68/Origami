"use client";

import React from "react";
import { Logo, Wordmark } from "./Logo";
import { useReveal } from "./useReveal";

export function CTA() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
      <div className="reveal relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-16 sm:px-16 text-center">
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" aria-hidden="true" />
        <Logo className="relative w-14 h-14 mx-auto animate-float text-fg" />
        <h2 className="relative heading-lg text-gradient mt-6">Your next 3D model is one doodle away</h2>
        <p className="relative mt-4 text-fg-muted max-w-lg mx-auto">
          Open the studio, draw something, and watch it unfold into three dimensions.
        </p>
        <a href="#studio" className="relative btn-primary !h-12 !px-7 mt-8">
          Open the studio
        </a>
      </div>
    </section>
  );
}

const COLS = [
  { title: "Product", links: [["How it works", "#how"], ["Studio", "#studio"], ["Features", "#features"], ["Gallery", "#gallery"]] },
  { title: "Resources", links: [["FAQ", "#faq"], ["API docs", "http://localhost:8000/docs"], ["Health check", "http://localhost:8000/api/health"]] },
  { title: "Built with", links: [["Google Gemini", "https://ai.google.dev"], ["TripoSG", "https://huggingface.co/VAST-AI"], ["React Three Fiber", "https://r3f.docs.pmnd.rs"]] },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Wordmark />
          <p className="mt-4 text-sm text-fg-faint max-w-xs leading-relaxed">
            Sketch it. Fold it into 3D. An AI studio for turning doodles into usable 3D assets.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fg">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.links.map(([label, href]) => {
                const external = href.startsWith("http");
                return (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="text-sm text-fg-muted hover:text-fg transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between text-xs text-fg-faint">
          <span>© {new Date().getFullYear()} Origami. All rights reserved.</span>
          <a href="#top" className="hover:text-fg transition-colors">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
