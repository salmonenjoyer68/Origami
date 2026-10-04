"use client";

import React, { useEffect, useState } from "react";
import { Wordmark } from "./Logo";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#studio", label: "Studio" },
  { href: "#features", label: "Features" },
  { href: "#gallery", label: "Gallery" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar({ backendOnline }: { backendOnline: boolean | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const status =
    backendOnline === true
      ? { dot: "bg-emerald-400", text: "Engine online" }
      : backendOnline === false
      ? { dot: "bg-rose-500", text: "Engine offline" }
      : { dot: "bg-amber-400 animate-pulse", text: "Connecting…" };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-studio-950/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between" aria-label="Main">
        <a href="#top" aria-label="Origami home">
          <Wordmark />
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-2 rounded-full text-sm text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span
            className="hidden sm:inline-flex items-center gap-2 h-8 px-3 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-400"
            title="FastAPI backend status (port 8000)"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.text}
          </span>
          <a href="#studio" className="hidden sm:inline-flex btn-primary !h-9 !px-4">
            Open Studio
          </a>
          <button
            type="button"
            className="md:hidden icon-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] px-5 pb-5 pt-2 animate-fade-in">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm text-zinc-300 hover:text-white border-b border-white/[0.04]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#studio" onClick={() => setOpen(false)} className="btn-primary w-full mt-4">
            Open Studio
          </a>
        </div>
      )}
    </header>
  );
}
