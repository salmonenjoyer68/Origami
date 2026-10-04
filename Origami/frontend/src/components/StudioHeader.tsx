"use client";

import React from "react";
import { Logo } from "./site/Logo";

interface StudioHeaderProps {
  backendOnline: boolean | null;
  onLoadSample: () => void;
  onOpenGuide: () => void;
}

export function StudioHeader({
  backendOnline,
  onLoadSample,
  onOpenGuide,
}: StudioHeaderProps) {
  return (
    <header className="h-14 border-b border-white/[0.08] bg-studio-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-30">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2.5 group">
          <Logo className="w-7 h-7 transition-transform group-hover:scale-105" />
          <div className="flex items-baseline gap-2">
            <span className="font-display text-base font-bold tracking-tight text-white">
              Origami
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Studio 2.0
            </span>
          </div>
        </a>

        {/* Backend health status badge */}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10 text-xs">
          {backendOnline === true && (
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API Online
            </span>
          )}
          {backendOnline === false && (
            <span className="inline-flex items-center gap-1.5 text-rose-400 font-medium" title="Backend not reachable on port 8000">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              API Offline
            </span>
          )}
          {backendOnline === null && (
            <span className="inline-flex items-center gap-1.5 text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-zinc-600 animate-pulse" />
              Connecting…
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onLoadSample}
          className="btn-secondary !h-8 !px-3 !text-xs !bg-brand-500/10 !border-brand-500/30 !text-brand-300 hover:!bg-brand-500/20"
          title="Load a pre-generated 3D origami crane demo model"
        >
          <span>⚡</span>
          <span className="hidden sm:inline">Load Demo Model</span>
          <span className="sm:hidden">Demo</span>
        </button>

        <button
          type="button"
          onClick={onOpenGuide}
          className="btn-secondary !h-8 !px-3 !text-xs"
          title="Open Quick Start Guide, Shortcuts, and FAQ"
        >
          <span>📖</span>
          <span className="hidden sm:inline">Guide &amp; FAQ</span>
          <span className="sm:hidden">Guide</span>
        </button>

        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="icon-btn !h-8 !px-2.5 text-xs text-zinc-400 hover:text-white hidden md:inline-flex items-center gap-1"
          title="FastAPI Swagger Documentation"
        >
          <span>API Docs</span>
          <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </header>
  );
}
